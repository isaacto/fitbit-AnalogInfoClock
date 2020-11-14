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
let floorRing = document.getElementById("floorRing");

// detail UI elements
let timeLabel = document.getElementById("timeLabel");
let battLabel = document.getElementById("battLabel");
let stepLabel = document.getElementById("stepLabel");
let floorLabel = document.getElementById("floorLabel");
let calLabel = document.getElementById("calLabel");

// timers
var hourStepTimer;
var detailTimer;

// hourly step count
const hourMilli = 60 * 60 * 1000;
var currHour = 0;
var hourStartSteps = 0;

// theme
var mainColor;

var theme = {
  "crimson": {
    "dark": "#420713",
    "center": "#611761"
  },
  "#dd9060": {
    "dark": "#4a2b17",
    "center": "#80253e"
  },
  "gold": {
    "dark": "#404010",
    "center": "#80253e"
  },
  "aquamarine": {
    "dark": "#113d34",
    "center": "#80253e"
  },
  "deepskyblue": {
    "dark": "#003647",
    "center": "#80253e"
  },
  "plum": {
    "dark": "#403040",
    "center": "#80253e"
  },
}

function setMainColor(newColor) {
  if (newColor == mainColor)
    return;
  document.getElementsByClassName("defColor").forEach((elt) => {
    elt.style.fill = newColor;
  });
  document.getElementsByClassName("darkColor").forEach((elt) => {
    elt.style.fill = theme[newColor]["dark"];
  });
  document.getElementsByClassName("centerColor").forEach((elt) => {
    elt.style.fill = theme[newColor]["center"];
  });
  fs.writeFileSync("settings.json", [newColor], "json");
}

try {
  let saved = fs.readFileSync("settings.json", "json");
  setMainColor(saved[0]);
} catch (err) {
  setMainColor("#dd9060");
}

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
  let currFloor = today.adjusted.elevationGain;
  if (currFloor !== undefined) {
    floorRing.sweepAngle = currFloor / goals.elevationGain * 360;
  }
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
    floorLabel.text = `${today.adjusted.elevationGain}/F`;
    calLabel.text = `${today.adjusted.calories}kCal`;
  }
}

function to2(s) {
  if (s.length < 2)
    return "0" + s;
  return s;
}

let myElement = document.getElementById("myElement");

messaging.peerSocket.addEventListener("message", (evt) => {
  console.log("msg: " + evt.data.key + "=>" + evt.data.value);
  if (evt && evt.data && evt.data.key === "mainColor") {
    setMainColor(evt.data.value);
  }
});