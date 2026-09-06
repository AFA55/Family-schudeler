import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

interface AIRecommendation {
  title: string;
  description: string;
  location: string;
  cost: string;
  url?: string;
}

interface SuggestedEvent {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface AIResponse {
  reply: string;
  recommendations?: AIRecommendation[];
  suggestedEvent?: SuggestedEvent;
}

// POST /api/chat/ai - AI planning assistant endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, familyId, roomId, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!familyId) {
      return NextResponse.json(
        { error: "familyId is required" },
        { status: 400 }
      );
    }

    // Verify the user is a member of this family
    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this family" },
        { status: 403 }
      );
    }

    // If a roomId is provided, verify it belongs to this family
    if (roomId) {
      const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        select: { familyId: true },
      });

      if (!room || room.familyId !== familyId) {
        return NextResponse.json(
          { error: "Chat room not found in this family" },
          { status: 404 }
        );
      }
    }

    // Generate mock AI response based on the message content
    // TODO: Wire up Claude API when API key is available
    const aiResponse = generateMockAIResponse(message.trim());

    // If a roomId is provided, save the user message and AI response to the room
    if (roomId) {
      await prisma.chatMessage.createMany({
        data: [
          {
            chatRoomId: roomId,
            senderId: userId,
            content: message.trim(),
            isAI: false,
          },
          {
            chatRoomId: roomId,
            senderId: userId,
            content: aiResponse.reply,
            isAI: true,
            metadata: JSON.parse(JSON.stringify({
              recommendations: aiResponse.recommendations ?? null,
              suggestedEvent: aiResponse.suggestedEvent ?? null,
            })),
          },
        ],
      });
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Failed to process AI request:", error);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}

function generateMockAIResponse(message: string): AIResponse {
  const lowerMessage = message.toLowerCase();

  // Outdoor / nature activities
  if (
    lowerMessage.includes("outdoor") ||
    lowerMessage.includes("park") ||
    lowerMessage.includes("hike") ||
    lowerMessage.includes("nature")
  ) {
    return {
      reply:
        "Great idea to get outdoors as a family! Here are some activities that would be perfect for quality time together in nature.",
      recommendations: [
        {
          title: "Family Nature Hike",
          description:
            "A beginner-friendly trail with scenic views, perfect for all ages. Pack a picnic for a mid-hike break.",
          location: "Local State Park",
          cost: "Free",
        },
        {
          title: "Botanical Garden Visit",
          description:
            "Explore beautiful gardens with seasonal exhibits and interactive areas for kids.",
          location: "City Botanical Garden",
          cost: "$10-15 per person",
          url: "https://example.com/botanical-garden",
        },
        {
          title: "Outdoor Scavenger Hunt",
          description:
            "Create a nature scavenger hunt list and explore your neighborhood or local park together.",
          location: "Any local park",
          cost: "Free",
        },
      ],
      suggestedEvent: {
        title: "Family Nature Hike",
        startTime: getNextSaturday(9, 0),
        endTime: getNextSaturday(12, 0),
        location: "Local State Park",
      },
    };
  }

  // Dinner / restaurant / food
  if (
    lowerMessage.includes("dinner") ||
    lowerMessage.includes("restaurant") ||
    lowerMessage.includes("food") ||
    lowerMessage.includes("eat") ||
    lowerMessage.includes("cooking")
  ) {
    return {
      reply:
        "Family meals are a wonderful way to connect! Whether dining out or cooking together, here are some ideas.",
      recommendations: [
        {
          title: "Family Cook-Off Night",
          description:
            "Pick a theme cuisine and have everyone contribute a dish. Great for learning and bonding.",
          location: "Home kitchen",
          cost: "$20-30 for ingredients",
        },
        {
          title: "Pizza Making Party",
          description:
            "Make homemade pizza dough and let everyone customize their own. Fun for all ages.",
          location: "Home",
          cost: "$15-25 for ingredients",
        },
        {
          title: "Family-Friendly Restaurant Night",
          description:
            "Try a new restaurant with a kids menu and a relaxed atmosphere for a stress-free evening.",
          location: "Local family restaurant",
          cost: "$40-80 for a family of 4",
        },
      ],
      suggestedEvent: {
        title: "Family Pizza Night",
        startTime: getNextFriday(17, 30),
        endTime: getNextFriday(19, 30),
        location: "Home",
      },
    };
  }

  // Movie / entertainment
  if (
    lowerMessage.includes("movie") ||
    lowerMessage.includes("film") ||
    lowerMessage.includes("watch") ||
    lowerMessage.includes("entertainment")
  ) {
    return {
      reply:
        "Movie time is a classic family favorite! Here are some ways to make it special.",
      recommendations: [
        {
          title: "Family Movie Marathon",
          description:
            "Pick a movie series and watch them back-to-back with themed snacks and cozy blankets.",
          location: "Home",
          cost: "Free (streaming subscription)",
        },
        {
          title: "Drive-In Movie Night",
          description:
            "A nostalgic experience the whole family will enjoy. Bring pillows and snacks.",
          location: "Local drive-in theater",
          cost: "$25-40 per car",
        },
        {
          title: "Outdoor Movie Setup",
          description:
            "Set up a projector in the backyard for an outdoor cinema experience under the stars.",
          location: "Backyard",
          cost: "$0-50 (projector rental if needed)",
        },
      ],
      suggestedEvent: {
        title: "Family Movie Night",
        startTime: getNextFriday(19, 0),
        endTime: getNextFriday(21, 30),
        location: "Home",
      },
    };
  }

  // Game / fun / play
  if (
    lowerMessage.includes("game") ||
    lowerMessage.includes("play") ||
    lowerMessage.includes("fun") ||
    lowerMessage.includes("board game")
  ) {
    return {
      reply:
        "Game time brings out the best in family bonding! Here are some ideas to get everyone involved.",
      recommendations: [
        {
          title: "Board Game Tournament",
          description:
            "Set up a bracket-style tournament with family-favorite board games and a small prize for the winner.",
          location: "Home",
          cost: "Free (use games you own)",
        },
        {
          title: "Bowling Night",
          description:
            "Head to the local bowling alley for bumper bowling and arcade games.",
          location: "Local bowling alley",
          cost: "$30-50 for a family of 4",
        },
        {
          title: "Escape Room Challenge",
          description:
            "Work together as a family to solve puzzles and escape. Great for teamwork and problem-solving.",
          location: "Local escape room venue",
          cost: "$25-35 per person",
        },
      ],
      suggestedEvent: {
        title: "Family Game Night",
        startTime: getNextSaturday(18, 0),
        endTime: getNextSaturday(21, 0),
        location: "Home",
      },
    };
  }

  // Default response for any other message
  return {
    reply:
      "I'd love to help you plan something fun for the family! Here are some popular activity ideas to get you started. Feel free to ask about specific types of activities like outdoor adventures, dining, games, or movie nights.",
    recommendations: [
      {
        title: "Weekend Family Picnic",
        description:
          "Pack your favorite foods and head to a scenic spot. Bring games like frisbee or a soccer ball.",
        location: "Local park",
        cost: "Free (bring your own food)",
      },
      {
        title: "Arts & Crafts Session",
        description:
          "Get creative together with painting, clay modeling, or scrapbooking. Perfect for a rainy day.",
        location: "Home",
        cost: "$10-20 for supplies",
      },
      {
        title: "Community Volunteer Day",
        description:
          "Find a local volunteer opportunity and give back as a family. Teaches kids about helping others.",
        location: "Local community center or food bank",
        cost: "Free",
      },
    ],
  };
}

// Helper: get an ISO string for the next occurrence of a given weekday
function getNextSaturday(hour: number, minute: number): string {
  const now = new Date();
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSaturday);
  next.setHours(hour, minute, 0, 0);
  return next.toISOString();
}

function getNextFriday(hour: number, minute: number): string {
  const now = new Date();
  const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilFriday);
  next.setHours(hour, minute, 0, 0);
  return next.toISOString();
}
