require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to DB: ${mongoose.connection.name}`);
  const collections = await mongoose.connection.db.collections();
  console.log(`Found ${collections.length} collections:`);
  for (let c of collections) {
      const count = await c.countDocuments();
      console.log(`- ${c.collectionName}: ${count}`);
  }
  process.exit(0);
}
test().catch(console.error);
