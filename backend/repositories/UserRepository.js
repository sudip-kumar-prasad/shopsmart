const User = require('../models/userModel.js');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserRepository();
