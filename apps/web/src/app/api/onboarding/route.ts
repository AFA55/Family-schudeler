import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import { onboardingSchema } from "@familysync/shared";

// GET /api/onboarding?userId=X - Get user's onboarding data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const onboarding = await prisma.userOnboarding.findUnique({
      where: { userId },
    });

    if (!onboarding) {
      return NextResponse.json(
        { error: "Onboarding data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ onboarding });
  } catch (error) {
    console.error("Failed to fetch onboarding data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/onboarding - Submit onboarding survey
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...surveyData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const parsed = onboardingSchema.safeParse(surveyData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const onboarding = await prisma.userOnboarding.upsert({
      where: { userId },
      create: {
        userId,
        interests: data.interests,
        currentActivities: data.currentActivities,
        goals: data.goals,
        wantRecommendations: data.wantRecommendations,
        activityTypes: data.activityTypes,
        maxTravelDistance: data.maxTravelDistance ?? null,
        address: data.address ?? null,
        preferredBudget: data.preferredBudget ?? null,
        helpCountryPreference: data.helpCountryPreference,
        completedAt: new Date(),
      },
      update: {
        interests: data.interests,
        currentActivities: data.currentActivities,
        goals: data.goals,
        wantRecommendations: data.wantRecommendations,
        activityTypes: data.activityTypes,
        maxTravelDistance: data.maxTravelDistance ?? null,
        address: data.address ?? null,
        preferredBudget: data.preferredBudget ?? null,
        helpCountryPreference: data.helpCountryPreference,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ onboarding }, { status: 201 });
  } catch (error) {
    console.error("Failed to save onboarding data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
