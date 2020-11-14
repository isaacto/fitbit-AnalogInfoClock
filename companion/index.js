import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me as companion } from "companion";

let KEY_COLOR = "mainColor";
let ACT_CONTENT = "actRingContent";

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
  sendValue(evt.key, evt.newValue);
});

// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
  sendValue(KEY_COLOR, settingsStorage.getItem(KEY_COLOR));
  sendValue(ACT_CONTENT, settingsStorage.getItem(ACT_CONTENT));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}
