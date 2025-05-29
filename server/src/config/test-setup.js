const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });

// Connect to test database before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/juvees-test');
});

// Clear database after each test
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
}); 