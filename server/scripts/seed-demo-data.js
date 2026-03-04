require('dotenv').config();
const mongoose = require('mongoose');
const argon2 = require('argon2');

const connectDB = require('../config/db');

const User = require('../models/User');
const RegistrationKey = require('../models/RegistrationKey');
const Article = require('../models/Article');
const Event = require('../models/Event');
const Product = require('../models/ShopItem');
const Action = require('../models/Action');
const Video = require('../models/Video');
const PressRelease = require('../models/Press');
const Banner = require('../models/InfoBanner');
const Contact = require('../models/Contact');
const Order = require('../models/Order');

async function seedRegistrationKey() {
  const existing = await RegistrationKey.findOne();
  if (existing) {
    console.log('RegistrationKey already exists, skipping');
    return existing;
  }
  const rawKey = 'ABCD';
  const hashedKey = await argon2.hash(rawKey, { type: argon2.argon2id });
  const doc = await RegistrationKey.create({ rawKey, hashedKey });
  console.log('RegistrationKey created with key ABCD');
  return doc;
}

async function seedUsers() {
  const existing = await User.findOne({ username: 'sangram' });
  if (existing) {
    console.log('User "sangram" already exists, skipping');
    return;
  }

  const password = await argon2.hash('sangram123', { type: argon2.argon2id });
  await User.create({
    username: 'sangram',
    password,
    roleLevel: 6,
    userLocation: 'BE',
    isActive: true,
  });
  console.log('User "sangram" created with password "sangram123"');
}

async function seedArticles() {
  const count = await Article.estimatedDocumentCount();
  if (count > 0) {
    console.log('Articles already exist, skipping');
    return;
  }

  await Article.insertMany([
    {
      title: 'Willkommen bei BKP',
      author: 'Redaktion der BKP',
      body: [
        { type: 'text', value: 'Dies ist ein Beispielartikel für die Startseite.' },
        { type: 'image', url: '/uploads/articles/1752081597511-740273337.avif' },
        { type: 'text', value: 'Sie können diesen Text im Admin-Bereich anpassen.' },
      ],
    },
    {
      title: 'Unsere Werte',
      author: 'Redaktion der BKP',
      body: [
        { type: 'text', value: 'Hier stehen die wichtigsten Werte der Bewegung.' },
        { type: 'image', url: '/uploads/articles/1750887973676-405164949.jpeg' },
      ],
    },
  ]);
  console.log('Demo articles created');
}

async function seedEvents() {
  const count = await Event.estimatedDocumentCount();
  if (count > 0) {
    console.log('Events already exist, skipping');
    return;
  }

  const now = new Date();
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  await Event.insertMany([
    {
      title: 'Öffentliche Infoveranstaltung',
      description: '<p>Offenes Treffen für alle Interessierten.</p>',
      isMandatory: false,
      eventDate: inFiveDays,
      date: inFiveDays,
      repeat: 'none',
      visibilityLevel: 7,
      eventLocation: 'BE',
      image: '/uploads/events/1750963714640-681891517.avif',
      isActive: true,
    },
    {
      title: 'Mitglieder-Plenum Bern',
      description: '<p>Interne Sitzung für Mitglieder in Bern.</p>',
      isMandatory: true,
      eventDate: inTenDays,
      date: inTenDays,
      repeat: 'none',
      visibilityLevel: 6,
      eventLocation: 'BE',
      image: '/uploads/events/1750967050713-873538487.avif',
      isActive: true,
    },
  ]);
  console.log('Demo events created');
}

async function seedProducts() {
  const count = await Product.estimatedDocumentCount();
  if (count > 0) {
    console.log('Products already exist, skipping');
    return;
  }

  await Product.insertMany([
    {
      name: 'BKP T-Shirt',
      category: 'clothing',
      stock: 20,
      orderCount: 0,
      mediaUrl: '/uploads/products/1750799371003-428781749.webp',
      price: 25,
      description: 'Klassisches BKP-T-Shirt in Schwarz.',
      isExternal: false,
      externalUrl: null,
      isActive: true,
      isFeatured: true,
      size: 'M',
    },
    {
      name: 'BKP Hoodie',
      category: 'clothing',
      stock: 10,
      orderCount: 0,
      mediaUrl: '/uploads/products/1750799535626-936907658.webp',
      price: 45,
      description: 'Warmer Hoodie mit BKP-Logo.',
      isExternal: false,
      externalUrl: null,
      isActive: true,
      isFeatured: false,
      size: 'L',
    },
  ]);
  console.log('Demo products created');
}

async function seedActions() {
  const count = await Action.estimatedDocumentCount();
  if (count > 0) {
    console.log('Actions already exist, skipping');
    return;
  }

  await Action.insertMany([
    {
      title: 'Straßenaktion für Klimaschutz',
      description: 'Mitglieder verteilen Flyer und informieren Passanten.',
      media: [
        '/uploads/actions/1752078732918-782311022.jpeg',
        '/uploads/actions/1752129910415-505276106.mp4',
      ],
    },
  ]);
  console.log('Demo actions created');
}

async function seedVideos() {
  // Clear existing and re-seed so we always have enough test videos for the carousel
  await Video.deleteMany({});

  await Video.insertMany([
    // ── Portrait / Shorts (need ≥3 for left/center/right carousel) ──
    {
      title: 'BKP Kurzvideo 1',
      videoId: 'dQw4w9WgXcQ',   // Rick Astley
      orientation: 'portrait',
    },
    {
      title: 'BKP Kurzvideo 2',
      videoId: '9bZkp7q19f0',   // Gangnam Style
      orientation: 'portrait',
    },
    {
      title: 'BKP Kurzvideo 3',
      videoId: 'kJQP7kiw5Fk',   // Despacito
      orientation: 'portrait',
    },
    {
      title: 'BKP Kurzvideo 4',
      videoId: 'JGwWNGJdvx8',   // Shape of You
      orientation: 'portrait',
    },
    {
      title: 'BKP Kurzvideo 5',
      videoId: '60ItHLz5WEA',   // Alan Walker - Faded
      orientation: 'portrait',
    },
    // ── Landscape (need ≥3 for carousel) ──
    {
      title: 'BKP Vorstellung 1',
      videoId: 'oHg5SJYRHA0',   // Rick Roll
      orientation: 'landscape',
    },
    {
      title: 'BKP Vorstellung 2',
      videoId: 'M7FIvfx5J10',   // Clean Bandit
      orientation: 'landscape',
    },
    {
      title: 'BKP Vorstellung 3',
      videoId: 'hT_nvWreIhg',   // Counter Intuitive
      orientation: 'landscape',
    },
  ]);
  console.log('Demo videos created (8 total: 5 portrait, 3 landscape)');
}

async function seedPress() {
  const count = await PressRelease.estimatedDocumentCount();
  if (count > 0) {
    console.log('Press releases already exist, skipping');
    return;
  }

  await PressRelease.create({
    title: 'BKP startet neue Kampagne',
    content: 'Die BKP startet eine neue Kampagne für mehr soziale Gerechtigkeit.',
    image: '/uploads/press/1765820411193-838554656.png',
    date: new Date(),
  });
  console.log('Demo press release created');
}

async function seedBanner() {
  const count = await Banner.estimatedDocumentCount();
  if (count > 0) {
    console.log('Banner already exist, skipping');
    return;
  }

  await Banner.create({
    statement: 'Jetzt Mitglied werden und mitgestalten!',
    link: '/contact-form',
    isActive: true,
  });
  console.log('Demo info banner created');
}

async function seedContacts() {
  const count = await Contact.estimatedDocumentCount();
  if (count > 0) {
    console.log('Contacts already exist, skipping');
    return;
  }

  await Contact.create({
    name: 'Max Mustermann',
    email: 'max@example.com',
    participation: 'member',
  });
  console.log('Demo contact created');
}

async function seedOrders() {
  const count = await Order.estimatedDocumentCount();
  if (count > 0) {
    console.log('Orders already exist, skipping');
    return;
  }

  const product = await Product.findOne();
  if (!product) {
    console.log('No products found, skipping demo order');
    return;
  }

  await Order.create({
    items: [
      {
        product: product._id,
        quantity: 2,
      },
    ],
    customerName: 'Max Mustermann',
    customerEmail: 'max@example.com',
    customerAddress: {
      street: 'Hauptstraße 1',
      postalCode: '3000',
      city: 'Bern',
      country: 'Schweiz',
    },
    paymentMethod: 'vorkasse',
    totalAmount: product.price * 2,
    status: 'pending',
  });
  console.log('Demo order created');
}

async function run() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await seedRegistrationKey();
    await seedUsers();
    await seedArticles();
    await seedEvents();
    await seedProducts();
    await seedActions();
    await seedVideos();
    await seedPress();
    await seedBanner();
    await seedContacts();
    await seedOrders();

    console.log('Seeding completed');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
