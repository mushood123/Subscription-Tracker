import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

/** @type {import("express").RequestHandler} */


const authorize = async (req, res, next) => {

  try {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'UNAUTHORIZE',
        error: 'TOKEN DOES NOT EXIST'
      });
    }

    const decode = jwt.verify(token, JWT_SECRET);

    const { userId } = decode;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: 'USER DOES NOT EXIST',
      });
    }

    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({
      message: 'UNAUTHORIZE',
      error: error?.message.toUpperCase()
    });

  }

};

export default authorize;