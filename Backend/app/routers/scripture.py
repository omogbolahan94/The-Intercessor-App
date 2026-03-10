from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user
from groq import Groq
import os
import json

router = APIRouter(
    prefix="/scripture",
    tags=["Scripture"]
)

# ── Initialise the Groq client ──
# Reads GROQ_API_KEY automatically from your .env file
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Model to use ──
# llama-3.3-70b-versatile is Groq's best free model
# It has strong Bible knowledge and follows instructions well
MODEL = "llama-3.3-70b-versatile"

# ── Fallback scripture ──
# Returned if the AI call fails for any reason
# Ensures the endpoint never returns an empty response
FALLBACK_SCRIPTURE = {
    "verse":     "Philippians 4:6-7",
    "text":      "Do not be anxious about anything, but in every situation, "
                 "by prayer and petition, with thanksgiving, present your "
                 "requests to God. And the peace of God, which transcends all "
                 "understanding, will guard your hearts and your minds in "
                 "Christ Jesus.",
    "theme":     "Peace & Trust",
    "reasoning": "This scripture is a beautiful reminder that God hears every "
                 "prayer and responds with a peace that surpasses understanding."
}


def call_groq(prompt: str) -> dict:
    """
    Sends a prompt to Groq's Llama 3 model and returns
    the parsed JSON response.

    This is a shared helper used by both scripture endpoints
    so we don't repeat the API call logic.
    """
    try:
        response = client.chat.completions.create(
            model    = MODEL,
            messages = [
                {
                    # System message sets Llama's overall behaviour
                    "role":    "system",
                    "content": (
                        "You are a compassionate and knowledgeable Bible scholar. "
                        "You have deep knowledge of both the Old and New Testament. "
                        "You always respond with valid JSON only — "
                        "no extra text, no markdown formatting, no code blocks, "
                        "no explanation outside the JSON object. "
                        "Your scripture recommendations are accurate, "
                        "encouraging and directly relevant to the person's situation."
                    )
                },
                {
                    "role":    "user",
                    "content": prompt
                }
            ],
            # Keep response focused and short
            max_tokens  = 600,
            # Lower temperature = more consistent, reliable responses
            # 0.7 gives a good balance of creativity and accuracy
            temperature = 0.7,
        )

        # ── Extract the text response ──
        response_text = response.choices[0].message.content.strip()

        # ── Clean the response ──
        # Sometimes models wrap JSON in markdown code blocks
        # even when told not to — we strip those just in case
        if response_text.startswith("```"):
            # Remove opening ```json or ``` and closing ```
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
            response_text = response_text.strip()

        # ── Parse the JSON ──
        scripture_data = json.loads(response_text)

        # ── Validate all required fields are present ──
        required_fields = ["verse", "text", "theme", "reasoning"]
        for field in required_fields:
            if field not in scripture_data:
                raise ValueError(f"Missing required field: {field}")

        return scripture_data

    except json.JSONDecodeError as e:
        print(f"⚠️ JSON parse error: {e}")
        print(f"⚠️ Model response was: {response_text}")
        return None

    except Exception as e:
        print(f"❌ Groq API error: {e}")
        return None


def build_daily_prompt(prayers: list, testimonies: list) -> str:
    """
    Builds the prompt for the daily scripture recommendation.
    Summarises the user's prayers and testimonies so Llama
    can pick the most relevant scripture for their situation.
    """

    # Format prayers into a clean readable list
    if prayers:
        prayer_lines = "\n".join([
            f"- [{p.category or 'General'}] {p.title}: "
            f"{p.body[:150]}{'...' if len(p.body) > 150 else ''}"
            for p in prayers
        ])
    else:
        prayer_lines = "No prayer requests yet."

    # Format testimonies into a clean readable list
    if testimonies:
        testimony_lines = "\n".join([
            f"- {t.testimony[:150]}{'...' if len(t.testimony) > 150 else ''}"
            for t in testimonies
        ])
    else:
        testimony_lines = "No testimonies yet."

    return f"""
A Christian is seeking a Bible scripture personalised to their current 
prayer needs. Based on their prayer requests and testimonies below, 
recommend the single most relevant and encouraging Bible scripture.

THEIR PRAYER REQUESTS:
{prayer_lines}

THEIR TESTIMONIES OF ANSWERED PRAYERS:
{testimony_lines}

Respond ONLY with a valid JSON object in exactly this format.
Do not include any text before or after the JSON:

{{
  "verse": "Book Chapter:Verse-Verse",
  "text": "The complete scripture text here",
  "theme": "2-4 word theme",
  "reasoning": "2-3 sentences explaining exactly why this scripture 
                was chosen for this person's specific situation"
}}

Important rules:
- Choose a scripture that directly addresses their prayer themes
- The reasoning MUST reference their specific prayers or situation
- Use NIV or ESV Bible translation
- Choose an encouraging and faith-building verse
- Keep the theme short and meaningful (e.g. "Healing & Restoration")
"""


def build_single_prayer_prompt(prayer: models.Prayer) -> str:
    """
    Builds the prompt for a scripture recommendation
    tied to one specific prayer request.
    """
    return f"""
A Christian needs an encouraging Bible scripture specifically 
for their prayer request below.

PRAYER CATEGORY: {prayer.category or "General"}
PRAYER TITLE: {prayer.title}
PRAYER REQUEST: {prayer.body}
PRAYER STATUS: {"Active - still believing for the answer" 
                 if prayer.status == "active" 
                 else "Answered - praising God for this breakthrough"}

Respond ONLY with a valid JSON object in exactly this format.
Do not include any text before or after the JSON:

{{
  "verse": "Book Chapter:Verse-Verse",
  "text": "The complete scripture text here",
  "theme": "2-4 word theme",
  "reasoning": "2-3 sentences explaining why this specific scripture 
                speaks to this specific prayer request"
}}

Important rules:
- The scripture must directly address the prayer's specific theme
- The reasoning must reference details from the prayer
- Use NIV or ESV Bible translation
- Choose a verse that gives hope and encouragement
"""


# ══════════════════════════════════════════
# GET DAILY SCRIPTURE
# GET /api/scripture/daily
# Protected — personalised for the logged-in user
# ══════════════════════════════════════════
@router.get("/daily", response_model=schemas.ScriptureResponse)
def get_daily_scripture(
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Returns an AI-recommended Bible scripture personalised
    for the logged-in user based on their 5 most recent
    prayer requests and 3 most recent testimonies.

    Falls back to Philippians 4:6-7 if:
    - The user has no prayers or testimonies yet
    - The AI call fails for any reason
    """

    # ── Fetch the user's recent prayers ──
    prayers = (
        db.query(models.Prayer)
        .filter(models.Prayer.user_id == current_user.id)
        .order_by(models.Prayer.created_at.desc())
        .limit(5)
        .all()
    )

    # ── Fetch the user's recent testimonies ──
    testimonies = (
        db.query(models.Testimony)
        .filter(models.Testimony.user_id == current_user.id)
        .order_by(models.Testimony.created_at.desc())
        .limit(3)
        .all()
    )

    # ── Return fallback if user has no activity yet ──
    if not prayers and not testimonies:
        return FALLBACK_SCRIPTURE

    # ── Build prompt and call Groq ──
    prompt = build_daily_prompt(prayers, testimonies)
    result = call_groq(prompt)

    # ── Return result or fallback ──
    return result if result else FALLBACK_SCRIPTURE


# ══════════════════════════════════════════
# GET SCRIPTURE FOR A SPECIFIC PRAYER
# GET /api/scripture/prayer/{prayer_id}
# Protected — scripture for one specific prayer
# ══════════════════════════════════════════
@router.get("/prayer/{prayer_id}", response_model=schemas.ScriptureResponse)
def get_scripture_for_prayer(
    prayer_id:    int,
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Returns an AI-recommended scripture specifically
    tailored to one prayer request.

    Useful for showing a relevant scripture alongside
    each prayer card on the dashboard.
    """

    # ── Find the prayer ──
    prayer = db.query(models.Prayer).filter(
        models.Prayer.id == prayer_id
    ).first()

    if not prayer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prayer request not found."
        )

    # ── Build prompt and call Groq ──
    prompt = build_single_prayer_prompt(prayer)
    result = call_groq(prompt)

    # ── Return result or fallback ──
    return result if result else FALLBACK_SCRIPTURE