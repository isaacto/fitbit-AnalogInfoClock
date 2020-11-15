# AnalogInfoClock

A deceptively simple analog clock focusing on usability rather than style.

The hour hand is on a disc telling how much of your daily step goal is completed, while the minute hand is on a disc telling how much of your hourly step goal is completed (unluckily this is best effort only, Fitbit API doesn't provide the information so it has to be guessed).  Between them there is an additional ring telling how much of either your daily floor goal or active minutes is completed.  The daily rings starts from 6 o'clock so that you can reasonably "chase the clock hand" when doing your activities.

The whole background is a battery level indicator.  Your heart rate is shown at the center.

If you want to know finer details than what an analog clock can show, tap on the clock.  A details page is shown, showing the time, battery level, daily and hourly step count, daily floor count and daily calories estimation in numbers rather than in shapes.  This details page is updated once a second, where the main page is updated at minute boundary.

Six themes are provided.  One of them is specifically created to match the color of the color of Versa 2 special edition.

This clock face is open-source.  See source code and latest development in:

    https://github.com/isaacto/fitbit-AnalogInfoClock

Version history:
  * 0.5: Allow calories/distance as activity ring.  Allow light background.  Switch to CLI development toolchain.
  * 0.4: Show activity minutes.  Select between showing activity or floor.
  * 0.3: Add color theme.  Use unit to indicate data shown in details page.
  * 0.2: Add details pane
  * 0.1.3: Use setTimeout to record start hour steps to cope with off clock
  * 0.1.1: Make hour steps survive app restart
  * 0.1: Initial version
