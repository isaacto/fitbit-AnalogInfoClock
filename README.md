# AnalogInfoClock

A deceptively simple analog clock focusing on usability rather than style.

Key features:
  * Six colors to select from, light or dark background
  * Analog main page, digital detail pages

Main page:
  * Updated at minute boundary
  * Show date and time as usual
  * Hour hand on a disc telling daily step goal completion
  * Minute hand on a disc telling hourly step goal completion (best effort, Fitbit has no API for it so it is guessed)
  * Between them there is an activity ring showing one of daily active minute, calories, distance and floor goals completion
  * Daily completion starts from 6 o'clock, allowing one to "chase the clock hand"
  * Battery level indicator as background
  * Heart rate shown at the center.

Detail page:
  * Updated every second
  * Time / Battery level
  * Daily and hourly step count
  * Distance and floor count
  * Calories and activity minutes
  * Heart rate
  * Barometer

This clock face is open-source.  See source code and latest development in:

    https://github.com/isaacto/fitbit-AnalogInfoClock

Version history:
  * 0.5.3: SDK 5.0 branch, use percentage values in SVG to avoid multi-version
  * 0.5.2: Clarify time, respect user 12h/24h preference
  * 0.5.1: Show heart rate and barometer
  * 0.5: Allow calories/distance as activity ring.  Allow light background.  Switch to CLI development toolchain.
  * 0.4: Show activity minutes.  Select between showing activity or floor.
  * 0.3: Add color theme.  Use unit to indicate data shown in details page.
  * 0.2: Add details pane
  * 0.1.3: Use setTimeout to record start hour steps to cope with off clock
  * 0.1.1: Make hour steps survive app restart
  * 0.1: Initial version

// Local Variables:
// mode: markdown
// eval: (auto-fill-mode -1)
// End:
