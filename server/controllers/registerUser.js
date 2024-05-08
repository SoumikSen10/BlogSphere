import { User } from "../models/User.models";

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const createdUser = await User.create({
    username,
    password,
  });
  res.status(200).json({
    createdUser,
  });
};

export { registerUser };
