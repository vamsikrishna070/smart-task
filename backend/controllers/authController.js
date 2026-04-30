import { User } from '../models/User.js';
import { signToken } from '../lib/jwt.js';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
    });
    await user.save();

    // Generate token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
}
