// -*- mode: javascript; js-indent-level: 2; -*-

import { me as appbit } from "appbit";
import { clock } from "clock";
import { display } from "display";
import document from "document";
import * as fs from "fs";
import { HeartRateSensor } from "heart-rate";
import * as messaging from "messaging";
import { battery } from "power";
import { today, goals } from "user-activity";

// Settings
clock.granularity = "minutes";

// Constants
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const coarseHrm = new HeartRateSensor({ frequency: 10 });

// main UI elements
const mainSect = document.getElementById("main");
const detailSect = document.getElementById("detail");

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let dayLabel = document.getElementById("dayLabel");
let monthLabel = document.getElementById("monthLabel");
let wdayLabel = document.getElementById("wdayLabel");
let apmLabel = document.getElementById("apmLabel");

let heartRateLabel = document.getElementById("heartRateLabel");
let batteryRect = document.getElementById("batteryRect");
let dayStepsElts = document.getElementsByClassName("daySteps");
let hourStepsElts = document.getElementsByClassName("hourSteps");
let actRing = document.getElementById("actRing");

// detail UI elements
let timeLabel = document.getElementById("timeLabel");
let battLabel = document.getElementById("battLabel");
let stepLabel = document.getElementById("stepLabel");
let floorLabel = document.getElementById("floorLabel");
let calLabel = document.getElementById("calLabel");
let actLabel = document.getElementById("actLabel");
let distLabel = document.getElementById("distLabel");

// timers
var hourStepTimer;
var detailTimer;

// hourly step count
const hourMilli = 60 * 60 * 1000;
var currHour = 0;
var hourStartSteps = 0;

// settings
var mainColor;
var lightBg = false;
var actRingContent = "Floor";

var theme = {
  "crimson": {
    "on-dbg": "#420713",
    "off-lbg": "#a11531",
    "center-dbg": "#611761",
    "center-lbg": "#b82eb8"
  },
  "#dd9060": {
    "on-dbg": "#4a2b17",
    "off-lbg": "#ab673a",
    "center-dbg": "#80253e",
    "center-lbg": "#c7385e"
  },
  "gold": {
    "on-dbg": "#404010",
    "off-lbg": "#adad2f",
    "center-dbg": "#80253e",
    "center-lbg": "#c7385e"
  },
  "aquamarine": {
    "on-dbg": "#113d34",
    "off-lbg": "#31ad94",
    "center-dbg": "#80253e",
    "center-lbg": "#c7385e"
  },
  "deepskyblue": {
    "on-dbg": "#003647",
    "off-lbg": "#008fba",
    "center-dbg": "#80253e",
    "center-lbg": "#c7385e"
  },
  "plum": {
    "on-dbg": "#403040",
    "off-lbg": "#bd93bd",
    "center-dbg": "#80253e",
    "center-lbg": "#c7385e"
  },
}

function updateColor() {
  document.getElementsByClassName("fgColor").forEach((elt) => {
    elt.style.fill = lightBg ? "black" : mainColor;
  });
  document.getElementsByClassName("offColor").forEach((elt) => {
    elt.style.fill = lightBg ? theme[mainColor]["off-lbg"] : "black";
  });
  document.getElementsByClassName("onColor").forEach((elt) => {
    elt.style.fill = lightBg ? mainColor : theme[mainColor]["on-dbg"];
  });
  document.getElementsByClassName("centerColor").forEach((elt) => {
    elt.style.fill = theme[mainColor][lightBg ? "center-lbg" : "center-dbg"];
  });
}

function saveSettings() {
  fs.writeFileSync("settings.json",
                   [mainColor, actRingContent, lightBg],
                   "json");
}

try {
  let saved = fs.readFileSync("settings.json", "json");
  mainColor = saved[0];
  actRingContent = saved[1];
  lightBg = saved[2];
} catch (err) {}
try {
  updateColor();
} catch (err) {
  mainColor = "#dd9060";
  updateColor();
  saveSettings();
}
if (actRingContent === undefined)
  actRingContent = "Floor";

// Utility functions

function hoursToAngle(hours, minutes, seconds) {
  return (360 / 12) * (hours + minutes / 60 + seconds / 3600);
}

function minutesToAngle(minutes, seconds) {
  return (360 / 60) * (minutes + seconds / 60);
}

// Clock face update

function updateClock() {
  updateDatetime();
  updateBattery();
  if (HeartRateSensor)
    updateHeartRate();
  if (appbit.permissions.granted("access_activity"))
    updateActivity();
}

function updateDatetime() {
  let now = new Date();
  let hours = now.getHours() % 12;
  let mins = now.getMinutes();
  let secs = now.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins, secs);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins, secs);
  //secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  monthLabel.text = monthNames[now.getMonth()];
  dayLabel.text = `${now.getDate()}`;
  wdayLabel.text = dayNames[now.getDay()];
  apmLabel.text = (now.getHours() < 12) ? "am" : "pm";
}

function updateBattery() {
  let screenHeight = 300;
  let chargeLevel = Math.floor(battery.chargeLevel / 100 * screenHeight);
  batteryRect.y = screenHeight - chargeLevel;
  batteryRect.height = chargeLevel;
}

function updateHeartRate() {
  coarseHrm.addEventListener("reading", () => {
    heartRateLabel.text = `${coarseHrm.heartRate}`;
    coarseHrm.stop();
  });
  coarseHrm.start();
}

function updateActivity() {
  setHourStep();
  let currSteps = today.adjusted.steps;
  let stepsDegree = currSteps / goals.steps * 360;
  if (stepsDegree > 360) {
    stepsDegree = 360;
  }
  dayStepsElts.forEach((elt) => {
    elt.sweepAngle = stepsDegree;
  });
  let hourStepsDegree = (currSteps - hourStartSteps) / 250 * 360;
  if (hourStepsDegree > 360) {
    hourStepsDegree = 360;
  }
  hourStepsElts.forEach((elt) => {
    elt.sweepAngle = hourStepsDegree;
  });
  let reading = 0;
  let goal = 1;
  if (actRingContent == "Floor") {
    reading = today.adjusted.elevationGain;
    goal = goals.elevationGain;
  } else if (actRingContent == "Active Minutes") {
    reading = today.adjusted.activeZoneMinutes.total;
    goal = goals.activeZoneMinutes.total;
  } else if (actRingContent == "Calories") {
    reading = today.adjusted.calories;
    goal = goals.calories;
  } else if (actRingContent == "Distance") {
    reading = today.adjusted.distance;
    goal = goals.distance;
  }
  if (reading === undefined) {
    reading = 0;
    goal = 1;
  }
  actRing.sweepAngle = reading / goal * 360;
}

function setHourStep() {
  let now = new Date();
  let hourNum = now.getHours() + now.getDate() * 24;
  if (currHour == 0) {
    try {
      let saved = fs.readFileSync("hour-steps.json", "json");
      currHour = saved[0];
      hourStartSteps = saved[1];
    } catch (err) {}
  }
  if (currHour == hourNum && today.adjusted.steps >= hourStartSteps)
    return;
  currHour = hourNum;
  hourStartSteps = today.adjusted.steps;
  fs.writeFileSync("hour-steps.json", [currHour, hourStartSteps], "json");
}

function setHourStepSchedule() {
  clearTimeout(hourStepTimer);
  let now = new Date();
  setHourStep();
  let currMilli = now.getTime();
  let hourPastMilli = currMilli - Math.floor(currMilli / hourMilli) * hourMilli;
  hourStepTimer = setTimeout(setHourStepSchedule, hourMilli - hourPastMilli);
}

setHourStepSchedule();

clock.addEventListener("tick", updateClock);
display.addEventListener("change", () => {
   if (display.on) {
     updateClock();
     mainSect.style.visibility = "visible";
     detailSect.style.visibility = "hidden";
   } else {
     clearInterval(detailTimer);
   }
});

mainSect.onclick = (evt) => {
  mainSect.style.visibility = "hidden";
  detailSect.style.visibility = "visible";
  detailTimer = setInterval(updateDetail, 1000);
  updateDetail();
}

detailSect.onclick = (evt) => {
  detailSect.style.visibility = "hidden";
  clearInterval(detailTimer);
  mainSect.style.visibility = "visible";
}

function updateDetail() {
  let now = new Date();
  let hours = to2("" + now.getHours() % 12);
  let mins = to2("" + now.getMinutes());
  let secs = to2("" + now.getSeconds());
  timeLabel.text = `${hours}:${mins}:${secs}`;
  battLabel.text = `${battery.chargeLevel}%`;
  if (appbit.permissions.granted("access_activity")) {
    let currSteps = today.adjusted.steps;
    stepLabel.text = `${currSteps};${currSteps - hourStartSteps}stp`;
    distLabel.text = `${today.adjusted.distance}m`;
    floorLabel.text = `${today.adjusted.elevationGain}/F`;
    calLabel.text = `${today.adjusted.calories}kCal`;
    actLabel.text = `${today.adjusted.activeZoneMinutes.total}'`;
  }
}

function to2(s) {
  if (s.length < 2)
    return "0" + s;
  return s;
}

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data.key == "mainColor") {
    if (!evt.data.value)
      return;
    mainColor = evt.data.value;
    updateColor();
  } else if (evt.data.key == "lightBg") {
    lightBg = evt.data.value;
    updateColor();
  } else if (evt.data.key == "actRingContent") {
    if (!evt.data.value)
      return;
    actRingContent = evt.data.value["values"][0]["name"];
    updateActivity();
  }
  saveSettings();
});
