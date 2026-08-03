// One-off script: creates a Superadmin (roleLevel 0) in the Admin collection.
require('dotenv').config();
const mongoose = require('mongoose');
const argon2 = require('argon2');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

async function run() {
    await connectDB();

    const existing = await Admin.findOne({ email: 'admin@bkp.local' });
    if (existing) {
        console.log('Admin already exists, skipping');
        await mongoose.connection.close();
        process.exit(0);
    }

    const hashed = await argon2.hash('admin12345', { type: argon2.argon2id });

    await Admin.create({
        name: 'Superadmin',
        email: 'admin@bkp.local',
        password: hashed,
        roleLevel: 0,
        isActive: true,
    });

    console.log('Superadmin created: admin@bkp.local / admin12345');
    await mongoose.connection.close();
    process.exit(0);
}

run().catch(err => {
    console.error('Failed:', err);
    process.exit(1);
});