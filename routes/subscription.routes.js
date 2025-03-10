import { Router } from 'express';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();


subscriptionRouter.get('/', (req, res) => {
  res.send({ title: 'GET ALL SUBCRIPTIONS' });
});

subscriptionRouter.get('/:id', (req, res) => {
  res.send({ title: 'GET SPECIFIC SUBCRIPTION' });
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
  res.send({ title: 'UPDATE SUBCRIPTION' });
});

subscriptionRouter.delete('/:id', (req, res) => {
  res.send({ title: 'DELETE SUBCRIPTION' });
});

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.get('/user/:id', (req, res) => {
  res.send({ title: 'DELETE USER SUBCRIPTION' });
});

subscriptionRouter.put('/:id/cancel', (req, res) => {
  res.send({ title: 'CANCEL USER SUBCRIPTION' });
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
  res.send({ title: 'GET UPCOMING RENEWALS' });
});

export default subscriptionRouter;