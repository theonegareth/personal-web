---
title: "KARASU and HAYABUSA: AeroBASE's autonomous drones for KRTI 2024 and 2025"
description: "How BINUS ASO's AeroBASE team went from a quadcopter doing autonomous gate detection at KRTI 2024 to HAYABUSA, a hexacopter with three LiDARs and two cameras, for KRTI 2025."
date: 2026-11-21
---

AeroBASE is the autonomous drone team at BINUS ASO School of Engineering. It builds fully autonomous UAVs, with a focus on vertical take-off and landing, and competes in KRTI, the Kontes Robot Terbang Indonesia (Indonesian Flying Robot Contest). I worked on the team as a software engineer across two competition drones: KARASU for KRTI 2024 and HAYABUSA for KRTI 2025. This is the overview. The [earlier post](/blog/autonomous-drone-technology/) goes into what broke and what we changed.

I was on the team from its founding in March 2024 to October 2025.

## KRTI and the mission

The deck's KRTI 2025 slides show two arenas. The outdoor field is 50 by 100 metres. The indoor course is a set of walls with autonomous start pads along one edge, two 2.50 m square drop zones with a red basket in each (40 cm tall, 30 cm inner diameter), and orange gate frames 1.50 m wide on stands.

The task has the same shape each year: fly the course, find an orange object, pick it up with an electromagnet, find the red basket, drop the object in it, fly through a gate, and land. No pilot touches the sticks.

The KRTI 2025 rulebook sets the VTOL theme as a long-range autonomous flight mission with the ability to fly indoors. The national VTOL round ran over two game days, 18 and 19 October 2025, at Universitas Andalas in Padang: group rounds first, then the semi-finals and the final.

## KARASU (2024)

KARASU was AeroBASE's first entry in KRTI and the team's first end-to-end build: airframe, software and flight testing. The team deck calls the KRTI 2024 drone its second-generation prototype, a quadcopter with prop guards, and captions it "Fully Autonomous Gate detection @KRTI 2024".

The deck's first generation was also a quadcopter with prop guards; its photo shows it on the floor of an indoor sports hall.

The stack was simple. A Cube flight controller running ArduPilot did the flying. A Raspberry Pi did the deciding: it read four TFmini LiDARs and its camera (the code was written for two), ran colour thresholding in OpenCV, and sent velocity commands to the Cube through DroneKit. The deck's sensor slide shows the result on screen: the bottom camera locking on to the orange object and steering it to a target point at pixel (320, 75), and the front camera boxing a gate.

KARASU had no simulation. Every change was tested by flying it, and the code history records a long run of flight-trial fixes.

The official KRTI 2024 announcements list Universitas Bina Nusantara's VTOL entry, "VTOL BINUS", as passing the proposal evaluation in May 2024 and the online inspection in July 2024, which put it into the regional round.

## HAYABUSA (2025)

HAYABUSA is the third generation: a hexacopter the team describes as built for autonomous navigation, take-off, landing and waypoint missions, with a modular payload bay. The deck shows it on the bench being wired and in outdoor flight tests.

### Sensors

HAYABUSA carries three LiDARs for obstacle avoidance and mapping, and two cameras. The front camera handles gate detection and navigation. The bottom camera handles object detection and the pick-up and drop tasks. That is one LiDAR fewer than KARASU, and the first time both cameras actually flew.

In the KRTI 2025 code the three LiDARs are TFmini rangefinders on the I2C bus, facing front, left and right. The launch configuration also defines a rear-facing one and leaves it switched off.

### Autonomy stack

The division of labour stayed the same. The Cube and ArduPilot fly the drone. The companion computer runs the perception and the mission. What changed is the layer above: the flight code moved to ROS 2 packages on a Jetson, still talking to the Cube through DroneKit, and colour thresholds gave way to a trained YOLO detector. ROS 2 Jazzy is the version the Gazebo simulation targets, not the flight computer. The software division's own list is ROS, OpenCV, YOLO, and companion computer integration. The electrical division handled the ArduPilot side: Mission Planner tuning and telemetry, gyro filtering, and PID analysis in MATLAB and Simulink.

![Block diagram of HAYABUSA: three LiDARs, a front camera and a bottom camera feed a companion computer running ROS 2, which sends flight commands to a Cube flight controller running ArduPilot and runs the KRTI mission from take-off to landing](/blog/aerobase-krti-drones/system.svg)

The detector is a YOLOv10n trained on one class, the orange object. It reached a mAP50 of 0.995 and a mAP50-95 of 0.92 around epoch 376 of a 1,000-epoch run. The deployed script undistorts the fisheye lens, runs the detector at 416 pixels, and projects the detection onto the ground using roll, pitch and yaw streamed from the flight controller at 20 Hz. A ground station box built by the electrical division holds the telemetry radio, RTK and a laptop.

### Simulation in Gazebo and ROS 2 Jazzy

HAYABUSA is the first AeroBASE drone with a simulation. The [GZassets repository](https://github.com/theonegareth/GZassets) holds the hexacopter as an SDF/URDF model with meshes for the frame, propellers and camera mounts, and a Gazebo Sim world with a ground plane, built for Gazebo Sim and ROS 2 Jazzy. The deck's R&D slide shows a ROS 2 DroneKit node arming a simulated drone in Gazebo Sim and climbing to its target altitude.

The simulation has a known hole. The README marks camera and LiDAR as not implemented, the IMU as partial, and the transform tree as not done; ROS 2 launch files only arrived in November 2025, after the KRTI 2025 season. So the simulator could test arming, take-off and mission sequencing, but not the perception that failed most often on the real drone.

## Results

The deck has no results. It shows flight tests on a grass field and the detector numbers above, and nothing from the competition itself.

HAYABUSA reached the KRTI 2025 national round. AeroBASE was one of 17 teams in the national VTOL division, drawn into group D as team D3, with a flight-test slot on 17 October and the group rounds on 18 October 2025.

## My role

I was a software engineer on AeroBASE. On KARASU I ran flight trials of obstacle avoidance and autonomous decision-making. KARASU's code had no ROS: it was DroneKit scripts on the Raspberry Pi. On HAYABUSA I built the Gazebo simulation model with Maul for flight control and mission testing, and built the benchmark harness that scores the team's detector candidates; Winston trained the YOLOv10n. The GZassets repository lists me and Maul as its developers. On HAYABUSA's flight code, my August 2025 commits added a navigator, a mission manager and a DroneKit bridge as ROS 2 nodes, and gave the drone-control module up and down moves and relative yaw turns; the team removed the three nodes on 1 September, before the competition.

## Team credit

AeroBASE runs as divisions: software, electrical, chassis and body, media, and internal. KARASU's mission code was written by Teresa and Raymond on vision and Kenrich Heavenly Sandria and Maulana Mu'ammar (Maul) on flight control. HAYABUSA's Gazebo model was built with Maul, and its detector was trained by Winston. The team is supported by BINUS University and its sponsors, Allo Bank and Banian.

## What next

The team has since moved to PX4, which is the 2026 team's story. The simulation's biggest open items are still open: cameras and LiDARs. The lesson I took from both drones is to put sensors in the simulator first, so it can fail in the same ways the real drone does.

