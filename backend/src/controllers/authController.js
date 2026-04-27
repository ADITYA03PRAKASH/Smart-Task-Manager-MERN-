const { registerUser, loginUser } = require('../services/authService');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password.',
    });
  }

  const { user, token } = await registerUser({ name, email, password, role });

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { user, token },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password.',
    });
  }

  const { user, token } = await loginUser({ email, password });

  res.json({
    success: true,
    message: 'Login successful.',
    data: { user, token },
  });
};

const getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

module.exports = { signup, login, getMe };
