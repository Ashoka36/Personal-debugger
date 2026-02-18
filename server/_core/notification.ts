// Simple notification service
export async function sendNotification(userId: number, title: string, message: string): Promise<void> {
  console.log(`Notification for user ${userId}: ${title} - ${message}`);
}

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  console.log(`Email to ${to}: ${subject} - ${body}`);
}

export async function notifyOwner(opts: { title: string; content: string }): Promise<boolean> {
  console.log(`[Owner Notification] ${opts.title}: ${opts.content}`);
  return true;
}
