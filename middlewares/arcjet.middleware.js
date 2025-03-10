import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {

  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: 'RATE LIMIT EXCEEDED',
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          error: 'BOT DETECTED',
        });
      }

      return res.status(403).json({
        error: 'ACCESS DENIED',
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default arcjetMiddleware;