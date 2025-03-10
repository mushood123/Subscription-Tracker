import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  // Extract subscription ID from the request payload
  const { subscriptionId } = context.requestPayload;

  // Fetch the subscription details
  const subscription = await fetchSubscription(context, subscriptionId);

  // Exit if subscription doesn't exist or isn't active
  if (!subscription || subscription.status !== 'active') {
    return;
  }

  // Parse the renewal date using dayjs
  const renewalDate = dayjs(subscription.renewalDate);

  // Skip if the renewal date has already passed
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}.`);
    return;
  }

  // Loop through each reminder interval
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    // Schedule the reminder if it's in the future
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    // Re-fetch subscription to ensure it's still active
    const updatedSubscription = await fetchSubscription(context, subscriptionId);
    if (updatedSubscription?.status === 'active') {
      await triggerReminder(context, `${daysBefore} days before reminder`, updatedSubscription);
    }
  }
});


const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    try {
      return await Subscription.findById(subscriptionId).populate('user', 'name email');
    } catch (error) {
      console.error(`Failed to fetch subscription ${subscriptionId}:`, error);
      return null;
    }
  });
};


const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};


const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    try {
      console.log(`Triggering ${label} reminder`);
      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      });
    } catch (error) {
      console.error(`Failed to send ${label} reminder:`, error);
    }
  });
};