---
title: "Building Embedded Systems with Arduino"
description: "What the fish feeder taught me about blocking code, sensors that lie, and testing one part at a time."
date: 2025-11-10
draft: false
---

The [automatic fish feeder](https://github.com/theonegareth/SMARTFishFeeder) was one of my first
complete embedded builds: an Arduino, a DS3231 real-time clock, a continuous-rotation servo as the
gate, three ultrasonic sensors watching the food hopper, and an I2C LCD. Nothing in it is exotic.
What made it worth writing about is the sketch history. The repository still has every step from
the first "does the servo move" test to the final firmware, and the mistakes are visible in the
diffs.

## Circuits that survive contact with a breadboard

The first thing I learned is that a wiring diagram is a hypothesis. The EasyEDA schematic says the
LCD lives on the I2C bus, but it does not say at which address, and a display at the wrong address
prints nothing and reports nothing. So the repository starts with a small I2C scanner that walks
addresses 1 to 126 and prints whichever one answers. The address that ended up at the top of every
later sketch is `0x27`, with a note to change it if the backpack differs. It is worth running the
scanner before writing anything that talks to a new I2C part.

The ultrasonic sensors were the other lesson. An HC-SR04 that gets no echo does not return an
error; it returns a very large number. The firmware treats anything over a ceiling as `OVERLOAD`
and refuses to compute a fullness percentage from it, rather than showing 0% and making it look
like the hopper is empty. The fullness figure itself is a plain `map()` from "3 cm from the sensor"
to "full" and "tank depth" to "empty", clamped with `constrain()` so a noisy reading cannot push it
past 100.

The three-sensor design also changed under test. The early sketches average all three readings.
The final one still reads all three, but only trusts the third. I did not write down why at the
time, and I suspect it was cross-talk: three sensors pinging into the same small hopper hear each
other's echoes, and the average was worse than the best single reading. The honest lesson is that
redundancy only helps if the redundant sensors fail independently, and mine did not.

## Timing and scheduling without an RTOS

The feeding schedule is two fixed times a day, six in the morning and six in the evening. The very
first timer sketch does the obvious thing:

```cpp
if (now.hour() == 6 && now.minute() == 0 && now.second() == 0) {
	servo.write(90);
	delay(30000);
	servo.write(0);
}
```

That has two problems, and both matter on a real bench. The `delay(30000)` freezes the whole
board for thirty seconds, so the clock display stops and the hopper sensors stop reading. Worse,
the check requires `second() == 0` exactly, and the loop already sleeps for a second at the end,
so it is easy to wake up at second 1 and miss the window entirely. The next revision added
`triggeredMorning` and `triggeredEvening` flags so the feed fires once per minute window instead of
once per exact second, which fixed the missed feeds, but the thirty-second freeze was still there.

The final firmware drops `delay()` from the feeding path completely. The loop reads the clock every
pass, and a small `handleFeeding()` function compares the current second against a few constants:
at second 0 it pulses the servo one way, a second later it stops it, at second 5 it pulses the
other way, and a second later it stops again. The gate is open for five seconds, the display and
sensors keep running throughout, and there is no state to reset because the clock does the
sequencing. It is a state machine where the RTC is the state variable, which is about the simplest
scheduler you can build.

Two details in that path are worth knowing if you copy it. The servo is a continuous-rotation
type, so `write(90)` means "stop", not "go to ninety degrees", and the two pulse directions are
`write(30)` and `write(330)`. The Servo library clamps that second value to 180, which happens to
be what I wanted, but I should have written 180. And the RTC is set with
`rtc.adjust(DateTime(F(__DATE__), F(__TIME__)))`, which stamps the clock with the compile time.
That line is meant to run once and then be commented out. Left in, every reboot resets the clock
to the moment the sketch was last compiled, and the feeder is suddenly running on the wrong day.
The comment above that line in the sketch exists for exactly that reason.

## Debugging without a debugger

There is no step debugger on an Uno, so the repository is organised around the only tools you
have: serial output and isolation. Every subsystem got its own sketch before anything was
combined. `LCD_TEST` proved the display, `Servo_Test` and `Servo_Gate` proved the gate could open
and close on a timer, `RTC` proved the clock, `ULTRASONIC_TEST` and then `Measure_Fullness` proved
the hopper reading. Only then did `LCD_RTC` combine two parts, `LCD_RTC_Servo` three, and the
`Final_Project` sketches all of them. When something broke in the combined firmware, I already
knew which parts worked on their own, so the bug had to be in the seams.

Serial output stayed in the final firmware on purpose. Every loop prints the time, all three raw
distances, the computed fullness, and the status word. When the LCD shows `OVERLOAD` you can open
the monitor and see which sensor produced the bad reading, rather than guessing. On a board with
two kilobytes of RAM, a few `Serial.print` calls are the cheapest instrumentation you will ever
get, and the cost of removing them is that the next bug becomes invisible.

If I built it again I would change one thing in the main loop. Each pass calls `pulseIn()` three
times, once per sensor, and `pulseIn()` blocks for up to a second when there is no echo. Three
missing echoes means a three-second stall, which is the same class of problem as the original
`delay(30000)`, just smaller. The fix is the optional timeout argument to `pulseIn()`, set to the
round-trip time of the furthest distance you care about. It is one number, and it turns a sensor
that can hang the board into one that simply reports "nothing there".

That is the pattern I have carried into every board since: find the address before you write to
it, treat "no reading" as its own state, never block the loop, and keep the serial prints.
