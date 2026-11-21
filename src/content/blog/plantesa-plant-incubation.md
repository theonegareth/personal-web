---
title: "PLANTESA: a plant incubator with sensors, a water loop and a leaf-disease classifier"
description: "A 14-week BINUS ASO team project: an ESP32 and a Raspberry Pi 4 run a plant incubator's pumps and sensors, and a VGG19 classifier fine-tuned on tomato leaves reached 89.53% test accuracy."
date: 2026-11-21
---

PLANTESA was a semester project at BINUS ASO School of Engineering, run by a team of four over 14 weeks between February and June 2025. The goal was a small incubator that keeps a plant alive on its own: it reads the soil and the air, waters when it has to, recycles the water that drains through the pot, and photographs the leaves to check them for disease.

## The problem

The final deck opens with a plain claim: modern farming needs efficiency and precision. The team's answer was precision agriculture at the scale of one pot, with three stated goals: give plant research accurate data, allow remote monitoring through Firebase and a webcam, and irrigate automatically from soil moisture, NPK and ambient humidity readings. A fourth benefit was water reuse: the water that runs through the soil is caught and sent back to the main tank.

The deck's conclusion says who it was meant to help: farmers. It hopes PLANTESA can help them raise the quality of their harvest, waste less, and speed up the move to digital tools in Indonesian farming.

## The setup

The hardware splits into two controllers, as the decks describe them:

- **ESP32:** reads the sensors and drives the actuators through relays.
- **Raspberry Pi 4:** runs the machine learning, does OpenCV leaf detection from the camera, and talks to the ESP32 to get its data.
- **Sensors:** a capacitive soil moisture sensor, an SHT40 for temperature and humidity, an NPK sensor on RS485, an ultrasonic sensor and a water level sensor for the tank.
- **Actuators (five relays):** a 12 V sprinkler pump, a 12 V in-soil pump, a 12 V buffer pump that returns water to the main tank, an AC grow light and a fan.
- **Power:** a 12 V 10 A supply with a voltage converter feeding both boards.
- **Cloud:** Firebase stores the images and every sensor reading, and a web client reads from it.

The earlier deck wires the Pi and the ESP32 together over I2C. In the final build the ESP32 writes its readings and relay states straight to Firebase every three minutes, and the Pi works from Firebase too.

The team also designed the enclosure in 3D: a main incubator frame and a separate circuit housing, followed by a real build with a converted water gallon as the tank.

Brevan and Hans designed the 3D chassis.

![The finished PLANTESA incubator against a green wall: a tall red-and-black frame with a frosted panel and a fan on top, a converted water gallon labelled PLANTESA on red legs as the tank, and the red circuit housing on the floor beside it, with cables running between them.](/blog/plantesa-plant-incubation/finished-incubator.webp)

## How it works

![Flowchart of the PLANTESA system: after power-up the flow splits. System 2 waters the soil, catches the runoff in a buffer reservoir and pumps it back to the main reservoir. System 1 reads the NPK, SHT40 and ultrasonic sensors, switches the LED, and runs the Raspberry Pi's reservoir prediction and leaf CNN, then sends everything to Firebase and the website.](/blog/plantesa-plant-incubation/architecture.svg)

After power-up two flows run side by side. **System 2** is the water loop: the moisture sensor decides whether the main pump runs, water drains through the pot into a buffer reservoir below it, and once the buffer is full it is pumped back up to the main reservoir. That is the design in the decks. The ESP32 firmware committed on 20 June 2025 waters on a clock instead: the sprinkler at 06:00 and the in-soil pump at 06:00 and 16:00, five seconds each, and it runs the buffer pump whenever the water-level sensor reads under 30%. **System 1** is monitoring: the sensor readings, a relay-switched LED and the Raspberry Pi's two models, all sent to Firebase and the website.

The tank check has its own flowchart. On the first run the user fills the tank to 100% and the ultrasonic sensor records the maximum water height in centimetres. After that the sensor is read every minute. When the level reaches 15%, the system works out the time to empty using a tank model and sends the user a warning.

Firebase keeps the raw sensor readings in a `SensorsData` node, with the leaf results, photo schedule and tank estimates beside it. The website, "Plantesa - Smart Plant Incubator", shows the latest plant photo and one card per sensor.

## The machine learning

This was my part: the timeline lists me alone on "Training Machine Learning Model", weeks 4 to 9, and I drew the system flowcharts.

The early plan named two models: a CNN or YOLO for leaf colour and quality, and a random forest to predict water distribution from soil moisture and water level data. The leaf model is the one the decks report on.

For data I used the tomato classes of the public New Plant Diseases Dataset: ten classes, nine diseases from bacterial spot to yellow leaf curl virus plus healthy. The folder properties on the slide show 22,952 files in 22 folders, 366 MB.

Training was planned in two stages. A teacher network would go through data preparation, splitting and augmentation, train for as long as validation accuracy kept rising, and write accuracy and loss charts plus confusion matrices; a smaller student would then be distilled from it. I drew the flowcharts for both. The deck labels the 31 May run as the student, but the student notebook was never finished, so the 89.53% model is a VGG19 fine-tuned from ImageNet weights.

On the incubator, the Raspberry Pi takes photos every 30 minutes and uploads them to Firebase. A second step downloads them, converts them to greyscale, draws bounding boxes around the leaf and its brown spots, runs the trained model to predict the leaf's condition, labels the image, and uploads the labelled photo back.

## Results

| Model (date) | Base | Batch | Input | LR / epochs | Optimizer | Epochs | Train acc | Test acc | Time |
|---|---|---|---|---|---|---|---|---|---|
| VGG19, first run (30 May 2025) | VGG19 | 32 | 256×256×3 | 0.001 / 50 | Adam | 50 | 75.00 | 80.33 | ~4.5 h |
| VGG19, second run (31 May 2025) | VGG19 | 32 | 256×256×3 | 0.0001 / 100 | Adam | 35 | 98.22 | 89.53 | ~3.5 h |

The deck's training curves run to 35 epochs, the length of the 31 May run. Its normalized confusion matrix scores each class between 0.81 (early blight, late blight) and 0.99 (mosaic virus), with healthy leaves at 0.96. The biggest single confusion is target spot read as spider mites, at 0.11.

On a real leaf in the incubator, the pipeline marked 6.17% of the leaf as brown and labelled it late blight (timestamp 2025-06-04 22:15).

The team's written report says the camera in the incubator captures images of tomato leaves.

## What went wrong

- **The same photo got two diagnoses.** The identification slide labels a leaf with 6.17% brown as late blight on 4 June; the website screenshot shows what looks like the same image with the same 6.17%, labelled healthy on 11 June.
- **The dashboard was not finished.** The pump status cards read "Loading...", the next estimated photo time (16:02) is earlier than the last upload (18:43), and the estimated refill time reads 1620h 0m.
- **The NPK field is named wrong.** Firebase and the website store nitrogen as `natrium` (sodium).
- **Plan and build drifted apart.** The pre-processing slide resizes images to 224×224; training used 256×256. The progress deck planned a photo every hour; the flowchart takes one every 30 minutes. The random forest for water prediction never shows up in the results.
- **A redesign.** The final deck includes a "previous design" with a different enclosure, an earlier relay map (soil moisture on relay 2, a drain pump on relay 3, no fan), and a note that the ML results still had to be shown in Firebase.

The code moved on after the deck. On 20 June the pump cards were wired to the relay states the ESP32 sends to Firebase, and on 21 June the site changed how it picks the latest photo, condition and next photo time: it had sorted text timestamps by subtracting them, and now compares them as strings. The `natrium` name never changed: the final firmware still writes nitrogen under it.

## Team

The team was Brevan Anthony, Hans Gabriel Tjandra, Jonathan Matthew Halim and me. Brevan led the initial product design. Brevan, Hans and I put together the technical design. Brevan, Hans and Jonathan built the physical product. I trained the machine learning models. All four of us finished the product, evaluated it, and wrote and presented the final report.

Hans also added the test sketches for the SHT40, the NPK sensor and the water-level sensor to the project's testing repo.

I wrote the final ESP32 firmware and the website: the firmware is in the Plantesa repo, and the website, a Firebase-hosted page, is in the testing repo.

