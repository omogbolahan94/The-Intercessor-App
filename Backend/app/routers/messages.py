from fastapi import (
    APIRouter, Depends, HTTPException,
    WebSocket, WebSocketDisconnect, status
)
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.dependencies import get_current_user
from app.websocket_manager import manager
from app import models, schemas
from app.auth import decode_access_token
import json

# ── No prefix here — we handle full paths manually ────────
router = APIRouter(tags=["chat"])


def format_message(msg: models.Message) -> dict:
    return {
        "id":           msg.id,
        "prayer_id":    msg.prayer_id,
        "user_id":      msg.user_id,
        "content":      msg.content,
        "message_type": msg.message_type,
        "created_at":   msg.created_at.isoformat(),
        "author_name":  msg.author.name,
    }


def check_chat_access(
    prayer_id: int,
    user:      models.User,
    db:        Session
) -> bool:
    prayer = db.query(models.Prayer).filter(
        models.Prayer.id == prayer_id
    ).first()
    if not prayer:
        return False
    # Prayer owner always has access
    if prayer.user_id == user.id:
        return True
    # Check if user has interceded
    intercession = db.query(models.Intercession).filter(
        models.Intercession.prayer_id == prayer_id,
        models.Intercession.user_id   == user.id
    ).first()
    return intercession is not None


# ── GET: load message history ──────────────────────────────
@router.get("/prayers/{prayer_id}/messages")
def get_messages(
    prayer_id: int,
    db:        Session     = Depends(get_db),
    user:      models.User = Depends(get_current_user),
):
    if not check_chat_access(prayer_id, user, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must intercede for this prayer to view the chat."
        )
    msgs = (
        db.query(models.Message)
        .filter(models.Message.prayer_id == prayer_id)
        .order_by(models.Message.created_at.asc())
        .all()
    )
    return [format_message(m) for m in msgs]


# ── WebSocket: real-time chat ──────────────────────────────
@router.websocket("/prayers/{prayer_id}/ws")
async def prayer_chat_websocket(
    websocket: WebSocket,
    prayer_id: int,
    token:     str,
):
    db = SessionLocal()
    try:
        # ── Authenticate ──
        payload = decode_access_token(token)
        if not payload:
            await websocket.close(code=4001)
            return

        email = payload.get("sub")
        user  = db.query(models.User).filter(
            models.User.email == email
        ).first()

        if not user:
            await websocket.close(code=4001)
            return

        # ── Access check ──
        if not check_chat_access(prayer_id, user, db):
            await websocket.close(code=4003)
            return

        # ── Accept and join room ──
        await manager.connect(websocket, prayer_id)
        await manager.broadcast_to_room(prayer_id, {
            "type":    "system",
            "content": f"{user.name} joined the prayer room 🙏",
        })

        # ── Message loop ──
        try:
            while True:
                data = await websocket.receive_text()
                try:
                    payload_data = json.loads(data)
                    content      = payload_data.get("content", "").strip()
                    message_type = payload_data.get(
                        "message_type", "text"
                    )

                    if not content:
                        continue

                    if message_type not in ["text", "verse", "reaction"]:
                        message_type = "text"

                    # Persist to DB
                    new_msg = models.Message(
                        prayer_id    = prayer_id,
                        user_id      = user.id,
                        content      = content,
                        message_type = message_type,
                    )
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    # Broadcast to room
                    await manager.broadcast_to_room(
                        prayer_id,
                        {"type": "message", **format_message(new_msg)}
                    )

                except json.JSONDecodeError:
                    continue

        except WebSocketDisconnect:
            manager.disconnect(websocket, prayer_id)
            await manager.broadcast_to_room(prayer_id, {
                "type":    "system",
                "content": f"{user.name} left the prayer room",
            })

    finally:
        db.close()