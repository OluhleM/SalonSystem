require('dotenv').config();
(async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    const User = require('./models/User');
    const Product = require('./models/Product');
    const Booking = require('./models/Booking');

    // create or find seed user
    let user = await User.findOne({ email: 'seed@example.com' });
    if (!user) {
      user = await User.create({ name: 'Seed User', email: 'seed@example.com', password: 'Password123!' });
      console.log('Created user', user._id.toString());
    } else {
      console.log('Found user', user._id.toString());
    }

    // create or find seed product/service
    let product = await Product.findOne({ name: 'Seed Service' });
    if (!product) {
      product = await Product.create({ name: 'Seed Service', description: 'Test service', price: 49.99, durationMinutes: 60 });
      console.log('Created product', product._id.toString());
    } else {
      console.log('Found product', product._id.toString());
    }

    // create a booking for ~1 hour from now
    const dateTime = new Date(Date.now() + 60 * 60 * 1000);
    const booking = await Booking.create({ client: user._id, service: product._id, dateTime });
    console.log('Created booking', booking._id.toString());

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
})();
