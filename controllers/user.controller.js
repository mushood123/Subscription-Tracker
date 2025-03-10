import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
  try {

    const users = await User.find().select('-password');

    if (!users) {
      const error = new Error('USERS NOT FOUND');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'USERS RETRIEVED SUCCESSFULLY',
      data: users
    });

  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {

    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      const error = new Error('USER NOT FOUND');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'USER RETRIEVED SUCCESSFULLY',
      data: user,
    });

  } catch (error) {

    next(error);

  }
};