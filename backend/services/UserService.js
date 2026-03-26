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

  async getProfile(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }

  async updateUser(id, updateData) {
    const user = await UserRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // Update basic info
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.password) user.password = updateData.password;

    // Update addresses
    if (updateData.addresses) {
      user.addresses = updateData.addresses;
    }

    // Update Notification Prefs
    if (updateData.notificationPrefs) {
      user.notificationPrefs = { ...user.notificationPrefs, ...updateData.notificationPrefs };
    }

    const updatedUser = await user.save();
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      addresses: updatedUser.addresses,
      token: generateToken(updatedUser._id),
    };
  }
}

module.exports = new UserService();
