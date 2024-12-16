const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendMessage } = require("../kafka/producer");

exports.signup = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User already exists" });
  
      const user = await User.create({ email, password });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      // Emit Kafka Event
      await sendMessage("USER_REGISTERED", {
        userId: user._id,
        email: user.email,
        timestamp: new Date(),
      });
  
      res.status(201).json({ user, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
