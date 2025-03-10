import mongoose from 'mongoose';
import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

/** @type {import("express").RequestHandler} */

export const createSubscription = async (req, res, next) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const {
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      status,
      startDate } = req.body;

    const userId = req.user._id;

    const subscription = await Subscription.create([{
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      status,
      startDate,
      user: userId
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription[0].id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      message: 'SUBSCRIPTION CREATED SUCCESSFULLY',
      subscription: subscription[0],
      workflowRunId,

    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    next(error);

  }
};

export const getUserSubscriptions = async (req, res, next) => {

  try {

    if (req.params.id !== req.user.id) {
      const error = new Error('YOU ARE NOT THE OWNER OF THIS ACCOUNT');
      error.statusCode = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      subscriptions
    });

  } catch (error) {

    next(error);

  }
};
