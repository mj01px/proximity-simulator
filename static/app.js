const house = document.getElementById("house");
const wsStatus = document.getElementById("wsStatus");
const distStatus = document.getElementById("distStatus");
const relayStatus = document.getElementById("relayStatus");
const reconnectBtn = document.getElementById("reconnectBtn");

const ledBar = document.getElementById("ledBar");
const motor = document.getElementById("motor");
const motorText = document.getElementById("motorText");

const sensorEl = document.getElementById("sensor");
const objectEl = document.getElementById("object");

const fx = document.getElementById("fx");
const fxCtx = fx.getContext("2d");


// simulation config
// number of LEDs displayed
const LED_COUNT = 8;

// Distance thresholds (simulated "cm")
const THRESHOLDS_CM = [140, 120, 100, 82, 64, 48, 32, 20];

// distance is <= this value → relay turns ON
const RELAY_ON_CM = 20;

// conversion from pixels to simulated "cm"
const CM_PER_PX = 0.25;

// sensor position
const SENSOR_POS = { x: 0.50, y: 0.50 };


// LED UI setup
const leds = [];
ledBar.innerHTML = "";

for (let i = 0; i < LED_COUNT; i++) {
  const d = document.createElement("div");
  d.className = "led";
  ledBar.appendChild(d);
  leds.push(d);
}

function setLeds(level) {
  for (let i = 0; i < LED_COUNT; i++) {
    leds[i].classList.toggle("on", i < level);
  }
}


// relay and motor state


function setRelay(on) {
  relayStatus.textContent = `Relay: ${on ? "ON" : "OFF"}`;

  motor.classList.toggle("on", on);

  motorText.textContent = on ? "ON" : "OFF";
  motorText.classList.toggle("on", on);
  motorText.classList.toggle("off", !on);
}



// WebSocket
const WS_SCHEME = window.location.protocol === "https:" ? "wss" : "ws";
const WS_URL = `${WS_SCHEME}://${window.location.host}/ws`;

let ws = null;
let retry = 0;
let timer = null;

function setWs(text, cls) {
  wsStatus.textContent = text;
  wsStatus.classList.remove("ok", "wait", "bad", "neutral");
  wsStatus.classList.add(cls);
}

function connect(force = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  if (!force && ws &&
      (ws.readyState === WebSocket.OPEN ||
       ws.readyState === WebSocket.CONNECTING)) return;

  try { ws?.close(); } catch {}

  setWs("Connecting…", "wait");

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    retry = 0;
    setWs("Connected", "ok");
  };

  ws.onclose = () => {
    setWs("Disconnected", "bad");

    const wait = Math.min(1200 + retry * 600, 5000);
    retry++;

    setWs(`Reconnecting in ${Math.round(wait/1000)}s…`, "wait");
    timer = setTimeout(() => connect(false), wait);
  };

  ws.onerror = () => {
    setWs("Error", "bad");
  };
}

reconnectBtn?.addEventListener("click", () => connect(true));


// helpers
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function resizeFx() {
  const rect = house.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  fx.width = Math.round(rect.width * dpr);
  fx.height = Math.round(rect.height * dpr);

  fx.style.width = `${rect.width}px`;
  fx.style.height = `${rect.height}px`;

  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeFx);

function placeSensor() {
  const w = house.clientWidth;
  const h = house.clientHeight;

  const sx = SENSOR_POS.x * w;
  const sy = SENSOR_POS.y * h;

  sensorEl.style.left = `${sx - 7}px`;
  sensorEl.style.top = `${sy - 7}px`;

  return { sx, sy };
}

function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx*dx + dy*dy);
}

// convert pixels → simulated cm
function pxToCm(px) {
  return Math.round(px * CM_PER_PX);
}

function levelFromCm(cm) {
  let level = 0;

  for (let i = 0; i < THRESHOLDS_CM.length; i++) {
    if (cm <= THRESHOLDS_CM[i]) level = i + 1;
  }

  return clamp(level, 0, LED_COUNT);
}


// visual effect
function drawFx(sx, sy, cm, level) {
  const w = house.clientWidth;
  const h = house.clientHeight;

  fxCtx.clearRect(0, 0, w, h);

  const t = level / LED_COUNT;
  const radius = 40 + 240 * t;

  const g = fxCtx.createRadialGradient(sx, sy, 10, sx, sy, radius);
  g.addColorStop(0, `rgba(37,99,235,${0.68 * t})`);
  g.addColorStop(1, "rgba(37,99,235,0)");

  fxCtx.fillStyle = g;
  fxCtx.fillRect(0, 0, w, h);

  if (cm <= RELAY_ON_CM) {
    const r = fxCtx.createRadialGradient(sx, sy, 12, sx, sy, radius * 0.85);
    r.addColorStop(0, "rgba(239,68,68,0.10)");
    r.addColorStop(1, "rgba(239,68,68,0)");

    fxCtx.fillStyle = r;
    fxCtx.fillRect(0, 0, w, h);
  }
}


// state over WebSocket
let lastSent = { level: null, relayOn: null, cm: null };

function sendState(level, relayOn, cm) {
  if (
    lastSent.level === level &&
    lastSent.relayOn === relayOn &&
    lastSent.cm === cm
  ) return;

  lastSent = { level, relayOn, cm };

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "PROXIMITY",
      level,
      relayOn,
      cm
    }));
  }
}


// interaction


let inside = false;

house.addEventListener("mouseenter", () => {
  inside = true;
  objectEl.style.opacity = "1";
});

house.addEventListener("mouseleave", () => {
  inside = false;
  objectEl.style.opacity = "0";

  distStatus.textContent = "Distance: —";
  setLeds(0);
  setRelay(false);

  const { sx, sy } = placeSensor();
  drawFx(sx, sy, 999, 0);

  sendState(0, false, 999);
});

house.addEventListener("mousemove", (e) => {
  if (!inside) return;

  const rect = house.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  objectEl.style.left = `${x}px`;
  objectEl.style.top = `${y}px`;

  const { sx, sy } = placeSensor();
  const cm = pxToCm(dist(x, y, sx, sy));

  const level = levelFromCm(cm);
  const relayOn = cm <= RELAY_ON_CM;

  distStatus.textContent = `Distance: ${cm} cm`;

  setLeds(level);
  setRelay(relayOn);
  drawFx(sx, sy, cm, level);
  sendState(level, relayOn, cm);
});


// init
resizeFx();

const { sx, sy } = placeSensor();
drawFx(sx, sy, 999, 0);

setRelay(false);
setLeds(0);

connect();
