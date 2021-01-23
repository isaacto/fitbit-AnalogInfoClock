# AnalogInfoClock

We want easy access to the rich information kept in our watches.  Analog clocks are great because we can get a rough idea very quickly about whatever we care about.  And old ones like myself don't need to wait for our old eyes to adjust to a near object (or worse, to change our glasses).

If we want precise information, a digital clock is just a tap away.

Because of these focuses, I don't want to allocate screen estate to eye-candies.  This clock face simply give us a lot of information, in big numbers and big symbols.

Key features:
  * Six colors to select from, light or dark background (select one from the app setting in the mobile phone)
  * Analog main page, digital detail pages

Main page:
  * Updated at minute boundary
  * Show date and time as usual
  * Hour hand on a disc telling daily step goal completion
  * Minute hand on a disc telling hourly step goal completion (best effort, Fitbit has no API for it so it is guessed)
  * Between them there is an activity ring showing one of daily active minute, calories, distance and floor goals completion (select one from the app setting in the mobile phone)
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

A built version can be found in the Fitbit App Gallary

  * SDK4.2: https://gallery.fitbit.com/details/ecc779b9-a41c-409f-bd0d-94c90ea64c07
  * SDK5.0: https://gallery.fitbit.com/details/d89aa423-819b-4f80-8a69-96a7404c494c

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
