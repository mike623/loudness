const express = require("express");
var bodyParser = require("body-parser");
var applescript = require("applescript");

const app = express();
app.use(bodyParser.json({ extended: false }));

const exec = (q) =>
  new Promise((rr, rj) =>
    applescript.execString(q, (err, v) => (err ? rj(err) : rr(v)))
  );

const getVol = () => {
  const q =
    "output volume of (get volume settings) & output muted of (get volume settings)";
  return exec(q);
};

const setVol = (value) => {
  const q = `set volume output volume ${value} without output muted --100%`;
  return exec(q);
};

const mute = () => {
  const q = `set volume with output muted`;
  return exec(q);
};
const unmute = () => {
  const q = `set volume without output muted`;
  return exec(q);
};

app.get("/", async (req, res) => {
  try {
    const [vol, isMute] = await getVol();
    console.log({ vol });
    res.send(vol + "");
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});
app.post("/", async (req, res) => {
  try {
    const { value } = req.body;
    await setVol(value);
    res.send("ok");
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});
app.post("/mute", async (req, res) => {
  try {
    const [vol, isMute] = getVol();
    if (isMute) await unmute();
    else await mute();
    res.send("ok");
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});
app.post("/play", async (req, res) => {
  try {
    const q = `
    tell application "Google Chrome" to activate
    delay 2
    tell application "System Events"
      keystroke space
    end tell
      `
    await exec(q)

    res.send("ok");
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});
app.post("/skipIntro", async (req, res) => {
  try {
    const q = `
    tell application "Google Chrome" to activate
    delay 2
    tell application "System Events"
      keystroke s
    end tell
      `
    await exec(q)

    res.send("ok");
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("go");
});
