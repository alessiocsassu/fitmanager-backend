const { registerUser, loginUser, verifyUser } = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const verifyCredentials = async (req, res, next) => {
  try {
    const result = await verifyUser(req.body);
    if (!result) res.json({ message: "Wrong credentials", verified: false})
    res.json({ message: "Verified", verified: true })
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, verifyCredentials };
