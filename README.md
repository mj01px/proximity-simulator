# Proximity Sensor Simulator

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-4A4A4A?style=for-the-badge&logo=websocket&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)


Interactive proximity sensor simulation built with **FastAPI +
WebSockets**.\
The system simulates distance detection, progressive LED activation, and
a relay-controlled motor in real time through an interactive UI.

------------------------------------------------------------------------

## Overview

This project demonstrates a real-time frontend ↔ backend communication
model using WebSockets.

The frontend simulates a proximity sensor using mouse movement: -
Distance is calculated dynamically - LED levels increase progressively -
A relay is triggered when a critical threshold is reached - A motor
state is controlled by relay logic - State is synchronized with the
backend

------------------------------------------------------------------------

## Core Concepts Demonstrated

-   Real-time WebSocket communication
-   Event-driven state updates
-   Threshold-based control logic
-   Frontend-backend synchronization
-   IoT-inspired simulation architecture

------------------------------------------------------------------------

##  Architecture

### Backend

-   FastAPI
-   WebSocket endpoint (`/ws`)
-   Static file serving

### Frontend

-   HTML + CSS (custom UI)
-   Vanilla JavaScript
-   Canvas-based visual effects
-   Progressive LED rendering
-   Relay & motor state simulation

------------------------------------------------------------------------

##  Communication Flow

1.  User moves the mouse inside the sensor area.
2.  Distance is calculated (pixels → simulated cm).
3.  LED level is derived from predefined thresholds.
4.  Relay state is determined.
5.  State is sent to backend via WebSocket.
6.  Backend echoes authoritative state back to the client.

------------------------------------------------------------------------

## Relay Logic

``` text
If distance <= RELAY_ON_CM → Relay ON
Else → Relay OFF
```

LED levels increase progressively as distance decreases.

------------------------------------------------------------------------

## 🛠 Installation

Clone the repository:

``` bash
git clone https://github.com/YOUR_USERNAME/proximity-simulator.git
cd proximity-simulator
```

Create a virtual environment:

``` bash
python -m venv .venv
```

Activate the environment:

**Windows**

``` bash
.venv\Scripts\activate
```

**Mac / Linux**

``` bash
source .venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Run the server:

``` bash
uvicorn backend.main:app --reload --port 8000
```

Open in browser:

    http://127.0.0.1:8000

------------------------------------------------------------------------

## Educational Purpose

This project was built as a learning exercise to explore:

-   Real-time systems
-   WebSocket communication patterns
-   Simulation logic for embedded/IoT concepts
-   Clean UI implementation without frameworks

