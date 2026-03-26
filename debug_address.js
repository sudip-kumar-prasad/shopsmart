const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserService = require('./backend/services/UserService.js');
const User = require('./backend/models/userModel.js');

dotenv.config({ path: './backend/.env' });

const test = async () => {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }

    console.log(`Testing with User: ${user.name} (${user._id})`);

    const updateData = {
      addresses: [
        {
          name: 'Home',
          addressLine: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA',
          isDefault: true
        }
      ]
    };

    console.log('Updating user...');
    const result = await UserService.updateUser(user._id, updateData);
    console.log('Update Successful!', JSON.stringify(result, null, 2));

  } catch (err) {
    console.error('Update Failed!');
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

test();
