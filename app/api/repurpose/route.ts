import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { content, platforms, language } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 },
      );
    }

    const selectedPlatforms = platforms || ["twitter", "linkedin", "instagram"];
    const lang = language || "english";

    const prompt = `
You are a social media content expert.

I will give you a long-form article or text. Your job is to repurpose it into ready-to-post content for social media platforms.

Original content:
"""
${content.slice(0, 4000)}
"""

Generate content for these platforms: ${selectedPlatforms.join(", ")}

Rules:
${
  selectedPlatforms.includes("twitter")
    ? `
TWITTER (X):
- Create 3 tweet variations
- Each under 280 characters
- Use hooks that grab attention
- Include relevant hashtags (2-3 max)
- Make them standalone (don't need context)
`
    : ""
}
${
  selectedPlatforms.includes("linkedin")
    ? `
LINKEDIN:
- Create 1 LinkedIn post
- Professional tone
- Start with a hook line
- Use line breaks for readability
- 150-300 words
- End with a question or CTA
- Add 3-5 relevant hashtags at the end
`
    : ""
}
${
  selectedPlatforms.includes("instagram")
    ? `
INSTAGRAM:
- Create 1 Instagram caption
- Engaging and conversational
- Include emojis
- 100-200 words
- End with CTA (save this, share with a friend, etc)
- Add 10-15 hashtags at the end
`
    : ""
}
${
  selectedPlatforms.includes("tiktok")
    ? `
TIKTOK SCRIPT:
- Create 1 short video script (30-60 seconds)
- Start with a hook (first 3 seconds)
- Conversational tone
- Include [VISUAL] cues
- End with CTA
`
    : ""
}
${
  selectedPlatforms.includes("email")
    ? `
EMAIL NEWSLETTER:
- Create 1 email version
- Catchy subject line
- 200-400 words
- Casual professional tone
- Clear CTA at the end
`
    : ""
}

Language: ${lang === "russian" ? "Russian" : "English"}

IMPORTANT: Reply ONLY with valid JSON. No markdown. No backticks.
Format:
{
  "twitter": ["tweet1", "tweet2", "tweet3"],
  "linkedin": "post text",
  "instagram": "caption text",
  "tiktok": "script text",
  "email": {"subject": "subject line", "body": "email body"}
}

Only include platforms that were requested.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      data: result,
      platforms: selectedPlatforms,
      language: lang,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
