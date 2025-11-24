const userModel = require('../../user/models/userModel');
const ApiError = require('../../../utils/apiError');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/jwtToken');

const register = async ({ firstName, lastName, email, password }) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  const user = new userModel({ firstName, lastName, email });
  await user.setPassword(password);
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user._id });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken({ id: user._id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user._id });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

const currentUser = async userId => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};

const refresh = async ({ refreshToken }) => {
  const { verifyRefreshToken } = require('../../../utils/jwtToken');
  
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
};

module.exports = {
  register,
  login,
  currentUser,
  refresh,
};
