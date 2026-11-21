---
title: "A strawberry-picking robot arm with two webcams and YOLOv8n"
description: "How our five-person team built a servo arm that finds ripe strawberries with a YOLOv8n detector (mAP@0.5 about 0.976), works out their depth from two webcams, and cuts the stem with a scissor end effector."
date: 2026-11-21
---

From September 2025 to January 2026, for the Robotics Kinematics and Dynamics course at BINUS ASO School of Engineering, five of us (Group 2) built a robotic arm that picks strawberries. My part was the machine-learning model: the dataset, the labelling and the training. The rest of the arm was built by the team, and this post says who did what.

The course set the frame, not the topic. Every group had to design a robotic arm with an effector on its end, pick a theme from the lecturer's list (the first was Zero Hunger, robots that support agriculture), and derive its own case. Ours was strawberry picking. The group's earlier shortlist also had a hand-controlled FPV drone, a spray-painting arm, a rover/spider robot, a camera that follows its user, and a book sorter.

## The problem

Strawberries are still mostly picked by hand, which is slow, and the fruit bruises if it is squeezed too hard. The goal was an arm that does the whole job in one system: find a ripe strawberry, cut its stem, catch it and put it in a container, without damaging it.

## Design

The arm has a rotating base, a shoulder, an elbow and a wrist, and an end effector with a scissor blade. The early sketch shows a claw and scissors at the tip and a bucket beside the arm. Each joint is a hobby servo:

| Joint | Servo |
|---|---|
| Base | MG996R |
| Shoulder | DS3240 |
| Elbow | MG996R |
| Wrist | SG90s |
| Scissors | MG90s |

An Arduino Uno drives the servos through a 16-channel PCA9685 servo driver, powered by a 5 V 10 A supply. The cutting edge is a razor blade.

The first version was a cardboard mock-up, moved by hand to check the reach. Later photos show the arm in white plastic parts, tested inside a frame of wooden sticks that holds strawberries up like plants.

The parts were drawn in SolidWorks; the group's final report dates the CAD to 31 October 2025 and records the links as 3D printed by 5 November.

![The first mock-up: a cardboard arm with a cardboard base, held by hand on a tiled floor to check its reach](/blog/strawberry-picking-arm/cardboard-mockup.webp)

![SolidWorks render of the arm with each joint's servo labelled: MG996R at the base and elbow, DS3240 at the shoulder, SG90S at the wrist and MG90S on the scissors, with the basket at the tip](/blog/strawberry-picking-arm/labelled-render.webp)

![The printed white arm reaching into a frame of wooden sticks, its scissor head and basket under a red strawberry hanging on a string](/blog/strawberry-picking-arm/arm-with-strawberry.webp)

## Kinematics

The team modelled the arm as a planar two-link arm (shoulder and elbow) with a tool offset, swung round by a yaw joint at the base. The joint variables are q = [θ0, θ1, θ2, θ3]. The hand-calculation slides give the base box height d1 = 5 cm, the first link a2 = 22 cm and the second link a3 = 16.5 cm, and build a transform matrix for each link at test angles (360° for the base, 135° and 45° for the links, 45° at the wrist).

The arm that was built is smaller than those slides: the firmware it ran uses a 20 cm first link, a 13.2 cm second link and a 7 cm hand, and the first link's CAD part measures 200 mm between its pivots.

Forward kinematics, as written in the poster:

- r = L1 cos θ1 + L2 cos θ2 + L3
- z = L1 sin θ1 + L2 sin θ2 + z0
- x = r cos θ0 + x0, y = r sin θ0 + y0

The Arduino version measures the elbow angle relative to the shoulder and adds a 1.4 offset at the base and 7.5 for the height from the ground to the shoulder.

Inverse kinematics runs the other way. The base angle is θ0 = atan2(y, x). The remaining reach r = √(x² + y²) − L3 and the height z form a triangle with the two links, so the law of cosines gives the elbow: cos θ2 = (r² + z² − L1² − L2²) / (2 L1 L2). A target is only reachable when |L1 − L2| ≤ √(r² + z²) ≤ L1 + L2.

The team checked the solver in MATLAB. For a target at (0.1, 0.1, 0.1) m it returned joint angles of 45.00°, 109.02°, −132.35° and 0.00°. Feeding those angles back through forward kinematics landed on the target with an error norm of 5.72 × 10⁻¹⁷ m, so the forward and inverse sides agree with each other.

The poster also sets out the dynamics, τ = M(q)q̈ + C(q, q̇)q̇ + g(q) + τf, and argues that for slow servo motion gravity torque dominates. That is the reason given for joint safety limits and small interpolated steps: no sudden force spikes that could bruise the fruit.

## Perception

This was my part. The first model, trained on strawberry images from Kaggle and Roboflow, had a problem that only showed up on the bench: it detected *pictures* of strawberries but not real ones in front of the webcam.

The fix was the data. I mixed 50% Kaggle images (volume, for learning the shape) with 50% homemade webcam images (real lighting), and added negative samples: leaves, shelves and clothing with no strawberries in them, so a red shirt would stop counting as fruit. Labels were bounding boxes in YOLO format, drawn only on ripe strawberries, using a small Flask labelling app that ran on localhost. The set came to 232 images (187 train, 35 validation, about 10 test) plus 56 negative images. Training used mosaic (100%), HSV shifts for lighting, horizontal flips (50%), scaling (50%) and translation (10–20%).

The slides, the group's final report and the repo's dataset script all describe this as a 70/20/10 split.

The team compared YOLOv8 and YOLOv11 and chose YOLOv8n for real-time detection. On validation, the model found 101 ripe strawberries, with 3 false positives and 7 misses. mAP@0.5 was about 0.976. The best balance of precision and recall came at a confidence threshold of about 0.33 (F1 about 0.94); precision is close to perfect above about 0.62. Run live on the webcams, the detector showed 8.7 and 9.4 FPS.

The group's final report treats YOLOv8 itself as the CNN, with no separate classifier stage in its pipeline, and the laptop scripts in the repo load only the YOLO model. The poster describes one more step: each cropped strawberry passed to a CNN classifier that grades it as unripe, partially ripe, ripe or overripe.

For depth, two webcams act as a stereo pair. Each frame goes through YOLO; the left and right detections are paired by sorting them left to right on x; and the pixel difference between the pair (the disparity) gives the distance: Z = baseline × focal length / disparity. A calibration file (stereo.npz) holds the focal length, baseline and lens distortion. The camera calls depth Z but the arm calls height Z, so the axes are swapped before the target leaves the laptop.

## Control flow

![The pick cycle: two webcams capture, YOLOv8n detects ripe strawberries, stereo disparity gives depth, the axes are remapped, the Arduino receives X_cm, Z_cm, Y_cm over serial, inverse kinematics gives the joint angles, the PCA9685 moves the servos, and the scissor servo cuts the stem into the basket before the Arduino replies READY](/blog/strawberry-picking-arm/pipeline.svg)

One pick runs as a loop. The laptop sends the target to the Arduino over serial as "X_cm, Z_cm, Y_cm" (for example 12.50,25.30,5.20). The arm moves to the stem, the scissor servo cuts it, and the gripper catches the fruit for the basket. Python then waits for the Arduino to send "READY" before it sends a new target, so it never moves the arm in the middle of a move. If no strawberry is in view, the camera simply takes another photo.

Inverse kinematics runs on the Arduino, not on the laptop. The firmware reads the three numbers off the serial line and solves the joint angles itself, with the law-of-cosines triangle above and links of 20, 13.2 and 7 cm. It answers "IK unreachable" for a target out of reach, and it refuses to move if the shoulder, elbow or wrist angle breaks its safety limits. After a move it runs forward kinematics on the angles it reached and prints the position, as a check. The laptop's stereo script has no inverse kinematics in it; it only finds the target and sends it.

Enrico also designed a discrete controller for each servo in Simulink, on transfer-function models of the servos, with a sample time of 0.01 s (100 Hz). These are simulation results; the decks do not show them running on the arm:

| Servo | Role | Controller | P | I | D |
|---|---|---|---|---|---|
| MG996R | Base / elbow | PID | 4.5023 | 17.4680 | 0.2680 |
| DS3240 | Shoulder | PI | 0.0556 | 11.1175 | 0 |
| SG90S | Wrist | PI | 0.0698 | 13.9675 | 0 |
| MG90S | Scissor | PI | 0.0278 | 5.5564 | 0 |

## Results

The decks record the detector's numbers but no measured picks for the whole arm.

The group's final report gives no count of successful picks either. It says that in an indoor test, with a board that fixed each fruit's position and height, the system detected strawberries consistently and its stereo distances were off by about 2–3 cm on average, worse outside roughly 30–40 cm. The servos overshot, so a manual offset went into the software, and a bug in mapping negative y values sent the arm downward and was still open. The arm was shown at the Final Project Exhibition at BINUS Anggrek Campus on 9 January 2026.

## What went wrong

- **Pictures, not fruit.** The first detector learned from online images and failed on real strawberries, fixed by mixing in our own webcam images and negatives.
- **Positional bias in the data.** The 198 labelled strawberries cluster in the upper and middle of the frame.
- **More misses than false alarms.** 7 missed strawberries against 3 false positives on validation.

## Team

- **Bryan Wilberd Lo:** camera calibration, integration (Python + Arduino)
- **Enrico Ethan:** control system, transfer functions, PID tuning
- **Gareth Aurelius Harrison (me):** machine-learning model, dataset, training
- **Jancent:** assembly, setting up the environment
- **Samuel Justus Tan:** forward kinematics, inverse kinematics, Arduino code

