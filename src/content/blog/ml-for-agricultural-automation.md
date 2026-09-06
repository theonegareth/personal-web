---
title: "Machine Learning for Agricultural Automation"
description: "How PLANTESA's leaf-disease classifier went from chance to 89.5%, and what a Raspberry Pi and an ESP32 forced out of the design."
date: 2025-11-28
draft: false
---

PLANTESA is a plant incubator that waters itself, logs its own soil chemistry, and photographs
its tomato leaves every half hour to decide whether they are sick. It was built across three
repositories: the [training pipeline](https://github.com/theonegareth/Plantesa-training), the
[firmware and Pi scripts](https://github.com/theonegareth/Plantesa), and a
[testing repo](https://github.com/theonegareth/Plantesa-testing) of per-sensor sketches and the
dashboard. This post is about the machine learning half: what the model had to decide, how badly
the first versions did, and what the hardware forced out of the final design.

## The problem PLANTESA was solving

The incubator's sensing is done by an ESP32 running five FreeRTOS tasks, one per sensor. An SHT40
reads temperature and humidity every two seconds, a capacitive probe reads soil moisture, an RS485
probe reads nitrogen, phosphorus and potassium over Modbus, an A02YYUW waterproof ultrasonic sensor
reads the reservoir level, and an analog probe reads the buffer tank. Every three minutes the
readings go to a Firebase Realtime Database, and five relays act on them: a grow light, a fan, a
buffer pump that runs whenever the tank reading drops below 30%, and two watering pumps on a fixed
schedule, both at six in the morning and one of them again at four in the afternoon.

None of that needs a model. Thresholds and a clock cover it. The part that needed learning was the
camera. A Raspberry Pi 4B with a webcam captures a frame every thirty minutes, and from that one
image the system has to answer two questions: is this leaf diseased, and if so, with what? The
answer feeds a dashboard that shows the latest labelled photo, the predicted condition, the sensor
readings and pump states, so the person looking after the plants can see a problem before the
leaves make it obvious.

I split the image question in two. A convolutional network classifies the leaf into one of ten
classes, nine tomato diseases plus healthy. Alongside it, a model-free pass in OpenCV thresholds
the frame in HSV space, masks the green leaf area and the brown lesion area, and reports brown
pixels as a percentage of green. The classifier gives a label; the brown percentage gives a
continuous number the dashboard can trend over days. When the classifier is unsure, the trend is
still there.

## Training the leaf disease classifier

The data is the tomato subset of the New Plant Diseases Dataset on Kaggle, already augmented, with
roughly 1,800 images per class. Images are resized to 256 by 256, and I held out half of them as
the test split, which is generous but was the point: I wanted a number I could trust.

The first architecture was a small sequential CNN from a tutorial, three blocks of convolution,
batch normalisation and dropout, trained with Adam. I logged every run in a training registry, and
the registry is not flattering:

| Run | Learning rate | Batch | Epochs run | Train acc | Test acc |
|---|---|---|---|---|---|
| CNN baseline | 0.01 | 32 | 7 | 46.1% | 19.8% |
| CNN augmented | 0.001 | 64 | 50 | 83.8% | 9.7% |
| CNN augmented | 0.001 | 128 | 6 | 84.7% | 9.3% |
| CNN augmented | 0.0001 | 64 | 24 | 96.9% | 72.7% |
| CNN augmented | 0.0001 | 128 | 7 | 97.3% | 80.1% |
| VGG16 pretrained | 0.0001 | 32 | 30 | 81.3% | 83.9% |
| VGG19 pretrained | 0.0001 | 32 | 35 | 98.2% | 89.5% |

The second and third rows are the important ones. Training accuracy climbs to 84% while test
accuracy sits at 9 to 10%, which for ten classes is a coin flip. The validation loss in those runs
goes up, not down, and sits anywhere between 6 and 21. The network was memorising the training half and had
learned nothing that transferred. Dropping the learning rate by a factor of ten fixed it outright:
the same architecture reached 73% and then 80%. Batch normalisation with Adam at 0.001 was simply
too aggressive for a network this small on this data, and no amount of extra epochs was going to
help.

From there the gains came from transfer learning. VGG16 with ImageNet weights reached 82 to 84%
across its thirty-epoch runs, and VGG19 at the same learning rate, stopped early at epoch 35 of a planned
100, reached 89.5% on the held-out half. That is the number I quote. The training accuracy on that
run is 98%, so there is still an overfit gap, and the 95% in the benchmark template in the repo is
a placeholder that I never replaced with a real result. The model that shipped to the Pi is named
for its actual score: `tomato_disease_detector_loss-0.2826_acc-90.00.keras`.

One detail I would fix in the next round is the normalisation. The training notebook divides
pixel values by 225, a typo for 255, and the inference script on the Pi divides by 255. The model
therefore sees inputs about 12% darker than anything it trained on. It still works, which says
something about how forgiving the pretrained features are, but it is a silent mismatch, and silent
mismatches are the kind that cost accuracy without ever raising an error.

## Running it on constrained hardware

The hardware split decided itself. The ESP32 has a few hundred kilobytes of RAM and is busy
polling five sensors, so it does no vision at all. Its job is to be reliable: each sensor lives in
its own task with its own period, the ultrasonic reading goes through an exponential moving average
so a single bad echo cannot start the buffer pump, and the Modbus reads time out after a second and
return a sentinel rather than blocking the other tasks. Sensing and actuation stay on the
microcontroller; anything that needs a model goes to the Pi.

The Pi runs the full Keras model, unquantised. A VGG19-based classifier is heavy for a Raspberry
Pi 4B, and on a live camera feed it would be unusable. What makes it fine here is the cadence: one
inference every thirty minutes. Latency does not matter when you have 1,800 seconds to spend on
it. The OpenCV brown-spot pass, by contrast, runs in milliseconds, which is why it is the thing I
would trust for anything that needed to react quickly.

The plan for making the model genuinely small was knowledge distillation: train a compact student
network to match the VGG19 teacher's outputs as well as the labels, then deploy the student. The
teacher and student flowcharts are in the repository, and the student notebook is a stub. I ran
out of semester before I ran out of ideas, and the thirty-minute cadence meant the big model was
never the bottleneck, so it never got done.

Two things in the deployed script are on the list for the next revision. It reloads the model from
disk on every cycle instead of once at startup, which is wasteful even at this cadence. And the
committed version still pins the download URL to a single test upload from the third of June, a
leftover from debugging the Firebase round trip, where it should fetch the URL of the frame it has
just uploaded. Neither is hard to fix. Both are the sort of thing that only a second pair of eyes,
or a blog post, makes you notice.

What I took from PLANTESA is less about the model than about where to put it. The learning rate
lesson cost me a dozen runs. The architecture lesson, that a microcontroller should sense and act
while a computer thinks, cost nothing, because the constraints made the decision for me.
