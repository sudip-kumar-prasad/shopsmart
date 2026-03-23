const UserRepository = require('../repositories/UserRepository.js');
const generateToken = require('../utils/generateToken.js');

class UserService {
  async login(email, password) {
    const user = await UserRepository.findByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      };
    } else {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }
  }

  async register(name, email, password) {
    const userExists = await UserRepository.findByEmail(email);

    if (userExists) {
      const error = new Error('User already exists');
      error.status = 400;
      throw error;
    }

    const user = await UserRepository.create({
      name,
      email,
      password,
    });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      };
    } else {
      const error = new Error('Invalid user data');
      error.status = 400;
      throw error;
    }
  }
}

module.exports = new UserService();
