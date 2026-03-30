import { prisma, NotificationType } from "@familysync/database";

/**
 * Create a single notification for a user.
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data: data ?? undefined,
    },
  });
}

/**
 * Send a notification to all members of a family, excluding one user
 * (typically the user who triggered the action).
 */
export async function notifyFamilyMembers(
  familyId: string,
  excludeUserId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const members = await prisma.familyMember.findMany({
    where: {
      familyId,
      userId: { not: excludeUserId },
    },
    select: { userId: true },
  });

  if (members.length === 0) {
    return [];
  }

  const notifications = await prisma.notification.createMany({
    data: members.map((member) => ({
      userId: member.userId,
      type,
      title,
      body,
      data: data ?? undefined,
    })),
  });

  return notifications;
}

/**
 * Send a notification to all attendees of an event, excluding one user
 * (typically the user who triggered the action).
 */
export async function notifyEventAttendees(
  eventId: string,
  excludeUserId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const attendees = await prisma.eventAttendee.findMany({
    where: {
      eventId,
      userId: { not: excludeUserId },
    },
    select: { userId: true },
  });

  if (attendees.length === 0) {
    return [];
  }

  const notifications = await prisma.notification.createMany({
    data: attendees.map((attendee) => ({
      userId: attendee.userId,
      type,
      title,
      body,
      data: data ?? undefined,
    })),
  });

  return notifications;
}
