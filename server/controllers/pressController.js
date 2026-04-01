const path = require('path'); // ✅ Add this line
const fs = require('fs');
const nodemailer = require('nodemailer');
const PressRelease = require('../models/Press');
require('dotenv').config();


  const postRelease = async (req, res) => {
try {
    const { title, title_it, title_fr, title_en, content, content_it, content_fr, content_en } = req.body;

   if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

     const imageUrl = `/uploads/press/${req.file.filename}`;

const press = new PressRelease({
  title, title_it, title_fr, title_en,
  content, content_it, content_fr, content_en,
  image: imageUrl
});

  await press.save();
  res.send({ message: 'Press created successfully.', id: press._id });
} catch (error) {
   console.error('Create Press Error:', error);
    res.status(500).json({ message: 'Failed to create press release' });
}

};

const deleteRelease = async (req, res) => {
  try {
    const { id } = req.params;

    const press = await PressRelease.findById(id);
    if (!press) {
      return res.status(404).json({ message: 'Press release not found.' });
    }

    // 🗑️ Delete image from filesystem if exists
    if (press.image) {
      const imagePath = path.join(__dirname, '..', press.image);

      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    // 🗑️ Delete press from DB
    await PressRelease.findByIdAndDelete(id);

    res.json({ message: '✅ Press release deleted successfully.' });
  } catch (error) {
    console.error('❌ Delete Press Error:', error);
    res.status(500).json({ message: 'Failed to delete press release.' });
  }
};



const getRelease = async (_req, res) => {
  const releases = await PressRelease.find().sort({ date: -1 });
  res.send(releases);
};

const getReleaseById = async (req, res) => {
  try {
    const release = await PressRelease.findById(req.params.id);
    if (!release) return res.status(404).json({ message: 'Press release not found.' });
    res.send(release);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch press release.' });
  }
};




const sendReleaseEmail = async (req, res) => {
  try {
    const { email, pdfBase64 } = req.body;
    const press = await PressRelease.findById(req.params.id);

    const imagePath = press.image
  ? path.join(__dirname, '..', press.image)
  : null;


    if (!press) return res.status(404).json({ error: 'Press release not found.' });

    // ✅ Ensure /tmp folder exists
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // ✅ Decode and save PDF as file
    const base64Data = pdfBase64.replace(/^data:application\/pdf;.*base64,/, '');
    const filePath = path.join(tmpDir, `${Date.now()}_press.pdf`);
    await fs.promises.writeFile(filePath, base64Data, 'base64');

    // ✅ Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS          // ✅ Gmail App Password (not account password)
      },
    });

    // ✅ Prepare email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `📢 ${press.title}`,
      text: press.content.replace(/<[^>]+>/g, ''), // plain version
      html: `
  ${press.content}
  ${
    imagePath
      ? `<br/><img src="cid:pressImage" style="max-width:100%;margin-top:20px;border-radius:8px;" />`
      : ''
  }
`,
 // styled version
attachments: [
  {
    filename: 'press-release.pdf',
    path: filePath,
    contentType: 'application/pdf'
  },
  ...(imagePath && fs.existsSync(imagePath)
    ? [{
        filename: path.basename(imagePath),
        path: imagePath,
         cid: 'pressImage' 
      }]
    : [])
]


    };

    // ✅ Send email
 transporter.sendMail(mailOptions, async (err, info) => {
  await fs.promises.unlink(filePath);

  if (err) {
    console.error('❌ Email failed:', err);
    return res.status(500).json({
      error: 'Email failed to send.',
      details: err.message
    });
  }

  res.json({ message: '✅ Email sent successfully!' });
});


  } catch (error) {
    console.error('❌ Unexpected error in sendReleaseEmail:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



module.exports = { postRelease, deleteRelease, getRelease, getReleaseById, sendReleaseEmail };







// const path = require('path'); // ✅ Add this line
// const fs = require('fs');
// const nodemailer = require('nodemailer');
// const PressRelease = require('../models/Press');
// require('dotenv').config();


//   const postRelease = async (req, res) => {
// try {
//     const { title, content } = req.body;

//    if (!req.file) {
//       return res.status(400).json({ message: 'Image is required' });
//     }

//      const imageUrl = `/uploads/press/${req.file.filename}`;

// const press = new PressRelease({ 
//   title, 
//   content , 
//   image:imageUrl})

//   await press.save();
//   res.send({ message: 'Press created successfully.', id: press._id });
// } catch (error) {
//    console.error('Create Event Error:', err);
//     res.status(500).json({ message: 'Failed to create event' });
// }

// };

// const getRelease = async (_req, res) => {
//   const releases = await PressRelease.find().sort({ date: -1 });
//   res.send(releases);
// };




// const sendReleaseEmail = async (req, res) => {
//   try {
//     const { email, pdfBase64, imageBase64 } = req.body;
//     const press = await PressRelease.findById(req.params.id);

//     if (!press) return res.status(404).json({ error: 'Press release not found.' });

//     // ✅ Ensure /tmp folder exists
//     const tmpDir = path.join(__dirname, '../tmp');
//     if (!fs.existsSync(tmpDir)) {
//       fs.mkdirSync(tmpDir);
//     }

//     // ✅ Decode and save PDF as file
//     const base64Data = pdfBase64.replace(/^data:application\/pdf;.*base64,/, '');
//     const filePath = path.join(tmpDir, `${Date.now()}_press.pdf`);
//     await fs.promises.writeFile(filePath, base64Data, 'base64');

//     // ✅ Set up nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//       user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS          // ✅ Gmail App Password (not account password)
//       },
//     });

//     // ✅ Prepare email
//     const mailOptions = {
//       from: process.env.GMAIL_USER,
//       to: email,
//       subject: `📢 ${press.title}`,
//       text: press.content.replace(/<[^>]+>/g, ''), // plain version
//       html: press.content, // styled version
//     attachments: [
//   {
//     filename: 'press-release.pdf',
//     path: filePath,
//     contentType: 'application/pdf'
//   },
//   ...(imageBase64
//     ? [{
//         filename: 'imageAttachment.jpg',
//         content: imageBase64.split(',')[1],  // decode base64
//         encoding: 'base64',
//         contentType: 'image/jpeg'
//       }]
//     : []
//   )
// ],

//     };

//     // ✅ Send email
//     transporter.sendMail(mailOptions, async (err, info) => {
//       // 🧹 Clean up PDF file
//       await fs.promises.unlink(filePath);

//       if (err) {
//         console.error('❌ Email failed:', err);
//         return res.status(500).json({ error: 'Email failed to send.', details: err.message });
//       }

//       res.json({ message: '✅ Email sent successfully!' });
//     });

//   } catch (error) {
//     console.error('❌ Unexpected error in sendReleaseEmail:', error);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// };



// module.exports = { postRelease, getRelease, sendReleaseEmail };
