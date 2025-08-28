from fastapi import APIRouter

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.post("/start")
async def start_chat():
    """
    Start a new chat session.
    """
    return {"message": "Chat session started"}


@router.get("/{chat_id}")
async def get_chat_messages(chat_id: int):
    """
    Get messages from a chat session by ID.
    """
    return {"message": f"Get messages for chat with ID {chat_id}"}


@router.post("/{chat_id}/message")
async def send_message(chat_id: int, message: str):
    """
    Send a message in a chat session by ID.
    """
    return {"message": f"Send message to chat with ID {chat_id}: {message}"}
