---
title: "From KARASU to HAYABUSA: two KRTI drones"
description: "What AeroBASE's first competition drone taught us, and how the second one's stack, simulation and detector changed because of it."
date: 2025-12-05
draft: false
---

AeroBASE is the drone team at BINUS ASO School of Engineering. I joined as a software engineer in
2023, and in that time the team built two entries for the Kontes Robot Terbang Indonesia: KARASU
for KRTI 2024, our first end-to-end airframe, and HAYABUSA for KRTI 2025. The mission is the same
each year in outline. Fly a course, find an orange object, pick it up with an electromagnet, find
a red bucket, drop it, fly through a gate, land. What changed between the two drones was almost
everything about how we tried to do that, and most of the changes came from things that broke.

This is a team story, so the credits matter. KARASU's mission code was written by Teresa and
Raymond on vision and Kenrich and Maul on flight control; my work was on the ROS side and the
flight trials. HAYABUSA's Gazebo model was built with Maul and its detector was trained by Winston; I built
the benchmark harness and kept the simulation assets and the team's course notes.

## What the stack looks like

KARASU flew on a Cube flight controller running ArduPilot, with a Raspberry Pi as the companion
computer. The Pi talked to the Cube over serial with DroneKit and sent velocity setpoints in the
body frame; ArduPilot did the actual flying. Around the Pi were four TFmini LiDARs on the I2C bus,
facing left, right, front and down, at four addresses, and the mission script assumed two USB
cameras, one facing forward for the gate and one facing down for the object and the bucket. The
airframe that flew carried one camera. The mission script was written for two, and the second
arrived with HAYABUSA.

The [mission script](https://github.com/theonegareth/KRTI-VTOL) is a Python state machine with
threads. One thread holds altitude off the downward LiDAR, one runs each camera, and one runs a
path finder that reads the three horizontal LiDARs: if the front distance drops under half a
metre, check which side has more than a metre of clearance, turn that way once, and otherwise
stop. Object detection is HSV thresholding in OpenCV, orange for the object and red for the
bucket, with a PID loop driving the drone until the largest contour sits over a target point in
the bottom camera's frame.

HAYABUSA kept the same flight controller and the same division of labour, the Cube flies and the
computer decides, but changed the layers above it. Three LiDARs instead of four, two cameras for
real, ROS 2 Jazzy instead of bare DroneKit scripts, a Gazebo simulation of the airframe, and a
trained YOLO detector instead of colour thresholds. The team has since moved further, to PX4 and a
Jetson, but that is the 2026 team's story.

## Where simulation stopped matching reality

KARASU had no simulation at all, which is its own kind of gap. Every idea was tested by flying it.
You can see the cost of that in the commit history: an emergency landing on lost signal was added
in July 2024, a switch to hand control back to the pilot came a week later, and in August the
takeover mode was changed to Loiter and the hover time in the test script went from five seconds
to ten. Each of those is a flight that went wrong first.

Three things in the KARASU code are worth calling out because they are exactly the kind of thing
a simulation would have hidden anyway.

The first is the ground clearance constant. The downward LiDAR reads distance to the floor, and
altitude is that reading minus the height of the sensor above the landing gear. That offset is
8 centimetres in one script, 11 in another and 17 in a third, because every time the mount
changed someone measured it again. In a simulator the sensor sits exactly where you put it. On
the airframe it sits where the cable ties let it.

The second is the colour thresholds. The first front-camera script has an orange range two hue
units wide with a comment saying "not tested; if fail try subtracting red". The final version is
nineteen units wide, and the brightness floor dropped from 220 to 60. That widening is the record
of what indoor lighting, outdoor lighting and a slightly faded target did to a threshold that
looked perfect on a laptop screen.

The third is the target point. The bottom camera does not centre the object in the frame; it
centres it on pixel 320 by 75, well above the middle. That is where the electromagnet hangs
relative to the lens. It is one line, it is the single most important number in the pickup, and no
simulation of a camera would have produced it.

There is also a path that was tried and dropped. An early stabilisation script ran its own roll,
pitch and yaw PID loops on the Pi and sent attitude targets to the Cube at ten hertz. It never
worked well, and reading it back, one of its helpers built the quaternion from the wall clock. The
final script sends velocity setpoints only and leaves attitude to ArduPilot, which has a far
better control loop than anything a Pi can close over serial. That was the right call, and it is
the one I would make first on any new airframe.

HAYABUSA got the simulation KARASU lacked, and it produced a different gap. We modelled the
hexacopter in Gazebo Harmonic from the CAD meshes, wired it to ArduPilot software-in-the-loop
through the ArduPilot plugin, and wrote a Lua dynamic motor matrix so ArduPilot would fly a six
motor frame the plugin's examples did not cover. What the model never got was sensors beyond an
IMU. No camera, no LiDAR. So the simulation could test arming, takeoff and mission sequencing,
and could not test a single line of the perception stack, which was the part that had actually
failed in 2024. My R&D notes from that year have a chapter titled "Building a Drone WRONGLY in GZ
sim, please dont follow this for the files," and the [assets repository](https://github.com/theonegareth/GZassets)
only stopped depending on absolute paths and an internet download for the ground plane in a fix I
made this November. A simulation that only runs on the laptop it was built on is a demo, not a
tool.

The detector side went better. Winston trained a YOLOv10n on a single class, the orange object,
and the log shows it reaching a mAP50 of 0.995 and a mAP50-95 of 0.92 around epoch 376 of a
thousand-epoch run. I built the benchmark harness that scores each candidate model on a held-out
Roboflow set of 98 images and then times it frame by frame on two recorded videos, so we
could choose between versions on accuracy and frames per second together rather than on accuracy
alone. The videos are recordings, not live flights, which is the point: the same frames every time. The deployed script undistorts a fisheye lens with a four-coefficient calibration, runs
the detector at 416 pixels, and projects the largest detection onto the ground plane using the
live roll, pitch and yaw streamed from the flight controller at twenty hertz. That projection is
the answer to KARASU's magic pixel: instead of a hand-tuned target point, the geometry is
computed. It still assumes a camera height of exactly one metre, hardcoded, when the LiDAR is
right there. That is the next number to stop guessing.

## What I would do differently

Most of what I would do differently, HAYABUSA already did. Give the flight controller the flying
and the companion computer only the deciding. Replace colour thresholds with a trained detector
and benchmark it on speed as well as accuracy. Add a second camera. Put the code in ROS 2
packages so the sensor nodes, the control node and the mission node can be run and tested apart.

Three things I would still change. Put sensors in the simulator before anything else, because a
sim without a camera and a LiDAR cannot fail in the ways the real drone fails, and failing in the
right ways is the whole point. Feed measured altitude into the ground projection rather than a
constant, so the pickup geometry is right at 0.5 metres and at 2. And write the failures down at
the time. I can reconstruct KARASU's flight trials from commit messages and changed constants,
which is how this post was written, but a page of notes per flight would have told the next team
far more than "increase time to 10s".

The best thing about the two years is also the simplest: KARASU's problems were all problems you
could only find by flying, and HAYABUSA was designed by people who had flown it.
