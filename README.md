<div align="center">

<br/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&pause=1000&color=00BFA5&center=true&vCenter=true&width=600&lines=Proximity+Simulator;Detect.+React.+Simulate." alt="Typing SVG" />
</a>

<br/>

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/WebSocket-4A4A4A?style=flat-square&logo=websocket&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square"/>
</p>

</div>

<br/>

---

## `~/about`

```python
proximity_simulator = {
    "type":     "IoT Simulation · Full-Stack",
    "backend":  ["Python", "FastAPI", "WebSockets"],
    "frontend": ["HTML5", "CSS", "Vanilla JavaScript", "Canvas API"],
    "concept":  "Real-time proximity sensor with LEDs, relay, and motor state",
    "author":   "Mauro Junior · github.com/mj01px",
}
```

**Proximity Simulator** is an interactive proximity sensor simulation built with FastAPI and WebSockets. Mouse movement drives distance detection in real time — triggering progressive LED activation, relay logic, and motor state — all synchronized between frontend and backend through a live WebSocket connection.

```
proximity-simulator/
├── backend/     # FastAPI server  →  http://localhost:8000
└── static/      # HTML + CSS + JS frontend
```

---

## `~/features`

<table>
  <tr>
    <td valign="top" width="50%">
      <b>📡 Simulation</b><br/><br/>
      <ul>
        <li>Mouse movement → distance in simulated cm</li>
        <li>Progressive LED activation by threshold</li>
        <li>Relay triggered at critical distance</li>
        <li>Motor state controlled by relay logic</li>
        <li>Canvas-based visual rendering</li>
      </ul>
    </td>
    <td valign="top" width="50%">
      <b>⚙️ Architecture</b><br/><br/>
      <ul>
        <li>Real-time WebSocket communication (<code>/ws</code>)</li>
        <li>Event-driven state updates</li>
        <li>Backend echoes authoritative state to client</li>
        <li>Static file serving via FastAPI</li>
        <li>No frontend framework — pure JS</li>
      </ul>
    </td>
  </tr>
</table>

**Relay logic:**
```text
distance <= RELAY_ON_CM  →  Relay ON  →  Motor ON
distance >  RELAY_ON_CM  →  Relay OFF →  Motor OFF
```

---

## `~/getting-started`

```bash
git clone https://github.com/mj01px/proximity-simulator.git
cd proximity-simulator

# Setup
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # Linux / macOS

pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000  # → http://localhost:8000
```

---

## `~/stack`

<div align="center">

| Layer | Technologies |
|---|---|
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) |
| **Realtime** | ![WebSocket](https://img.shields.io/badge/WebSocket-4A4A4A?style=flat-square&logo=websocket&logoColor=white) |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Canvas API](https://img.shields.io/badge/Canvas_API-4A4A4A?style=flat-square&logo=html5&logoColor=white) |

</div>

---

<div align="center">
  <br/>
  <sub>
    Built by <a href="https://github.com/mj01px"><strong>Mauro Junior</strong></a>
    &nbsp;·&nbsp;
    <a href="https://www.linkedin.com/in/mauroapjunior/">LinkedIn</a>
  </sub>
  <br/><br/>
</div>
