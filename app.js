import express from 'express';
import cookieParser from 'cookie-parser';
import { NODE_ENV, PORT } from './config/env.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';



const app = express();


app.use(express.json());// Parses incoming request data into JSON format
app.use(express.urlencoded({ extended: false }));// Parse URL-encoded data with the querystring library (simple key-value pairs)
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);


app.get('/', (req, res) => {
  res.send('WELCOME TO THE SUBCRIPTION TRACKER API');
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'ROUTE NOT FOUND',
    method: req.method,
  });
});

app.listen(PORT, async () => {

  /* eslint-disable*/
  console.log(`Subscription Tracker API is running on http://localhost:${PORT} in ${NODE_ENV.toUpperCase()} MODE`);
  connectToDatabase((s) => console.log(s), (e) => console.log(e));
  /* eslint-enable */

});

export default app;  
