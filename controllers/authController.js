const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Dono tokens generate karo
const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES // 15m
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES // 7d
  });

  return { accessToken, refreshToken };
};

// ── REGISTER ── POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = await User.create({ email, password, role });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

// ── LOGIN ── POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // User dhundho
    const user = await User.findOne({ email });

    // Password check karo
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Refresh Token DB mein save karo (whitelist)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Refresh Token → httpOnly secure cookie mein
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,        // production mein true karna
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din milliseconds mein
    });

    // Access Token → JSON response mein
    res.status(200).json({
      message: 'Login successful',
      accessToken
    });
  } catch (err) {
    next(err);
  }
};

// ── REFRESH TOKEN ── POST /api/auth/refresh
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'No refresh token found in cookie.' });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DB mein check karo (whitelist match)
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Refresh token is invalid or revoked.' });
    }

    // Naya Access Token banao
    const { accessToken } = generateTokens(user);

    res.status(200).json({
      message: 'New access token issued',
      accessToken
    });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token expired or invalid.' });
  }
};