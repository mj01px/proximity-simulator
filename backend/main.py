from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Proximity Sensor Simulator")


app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
def root():
    return FileResponse(str(STATIC_DIR / "index.html"))


def now_hhmmss() -> str:
    return datetime.now().strftime("%H:%M:%S")


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    print(f"[{now_hhmmss()}] WS client connected")

    last_level: int | None = None
    last_relay: bool | None = None

    try:
        while True:
            data: dict[str, Any] = await ws.receive_json()

            if data.get("type") != "PROXIMITY":
                await ws.send_json({"type": "ERROR", "message": "Unknown message type"})
                continue

            level = int(data.get("level", 0))
            relay_on = bool(data.get("relayOn", False))
            cm = data.get("cm", None)

            # Log only on changes (anti-flood)
            if last_level is None:
                print(f"[{now_hhmmss()}] sensor init level={level} relay={'ON' if relay_on else 'OFF'} cm={cm}")
            else:
                if level != last_level:
                    print(f"[{now_hhmmss()}] proximity level changed: {last_level} -> {level} (cm={cm})")
                if relay_on != last_relay:
                    print(f"[{now_hhmmss()}] RELAY {'ON' if relay_on else 'OFF'} (cm={cm})")

            last_level = level
            last_relay = relay_on

            # Echo state back (authoritative status)
            await ws.send_json({
                "type": "STATE",
                "level": level,
                "relayOn": relay_on,
                "cm": cm,
                "ts": now_hhmmss(),
            })

    except WebSocketDisconnect:
        print(f"[{now_hhmmss()}]  WS client disconnected")
    except Exception as e:
        print(f"[{now_hhmmss()}] WS error: {e!r}")
        try:
            await ws.close()
        except Exception:
            pass
