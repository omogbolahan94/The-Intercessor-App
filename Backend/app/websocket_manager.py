from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        # Dict of prayer_id -> list of active WebSocket connections
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, prayer_id: int):
        await websocket.accept()
        if prayer_id not in self.active_connections:
            self.active_connections[prayer_id] = []
        self.active_connections[prayer_id].append(websocket)

    def disconnect(self, websocket: WebSocket, prayer_id: int):
        if prayer_id in self.active_connections:
            self.active_connections[prayer_id].remove(websocket)
            # Clean up empty rooms
            if not self.active_connections[prayer_id]:
                del self.active_connections[prayer_id]

    async def broadcast_to_room(self, prayer_id: int, message: dict):
        """Send a message to everyone in a prayer room."""
        if prayer_id not in self.active_connections:
            return
        disconnected = []
        for connection in self.active_connections[prayer_id]:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                disconnected.append(connection)
        # Clean up dead connections
        for conn in disconnected:
            self.active_connections[prayer_id].remove(conn)

    def get_room_count(self, prayer_id: int) -> int:
        """How many users are currently in a prayer room."""
        return len(self.active_connections.get(prayer_id, []))

# Single global instance shared across the app
manager = ConnectionManager()