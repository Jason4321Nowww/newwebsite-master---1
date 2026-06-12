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




// Multilingual labels for press email
const PRESS_LABELS = {
  de: {
    subjectSuffix: 'BKP Pressemitteilung',
    header:        'Pressemitteilung der Büezer und KMU Partei',
    footer:        'Offizielle Pressemitteilung der\nBüezer und KMU Partei',
  },
  it: {
    subjectSuffix: 'BKP Comunicato stampa',
    header:        'Comunicato stampa della Büezer und KMU Partei',
    footer:        'Comunicato stampa ufficiale della\nBüezer und KMU Partei',
  },
  fr: {
    subjectSuffix: 'BKP Communiqué de presse',
    header:        'Communiqué de presse du Büezer und KMU Partei',
    footer:        'Communiqué de presse officiel du\nBüezer und KMU Partei',
  },
  en: {
    subjectSuffix: 'BKP Press Release',
    header:        'Press release by the Büezer und KMU Party',
    footer:        'Official press release by the\nBüezer und KMU Party',
  },
};

const sendReleaseEmail = async (req, res) => {
  try {
    const { email, pdfBase64, lang, langTitle } = req.body;
    const press = await PressRelease.findById(req.params.id);
    if (!press) return res.status(404).json({ error: 'Press release not found.' });

    const useLang   = (lang && PRESS_LABELS[lang]) ? lang : 'de';
    const labels    = PRESS_LABELS[useLang];
    const emailTitle   = langTitle || (useLang === 'de' ? press.title : press[`title_${useLang}`] || press.title);
    const emailContent = useLang === 'de' ? press.content : (press[`content_${useLang}`] || press.content);

    // Format date
    const dateStr = new Date(press.date || Date.now()).toLocaleDateString(
      useLang === 'de' ? 'de-CH' : useLang === 'it' ? 'it-CH' : useLang === 'fr' ? 'fr-CH' : 'en-GB',
      { day: '2-digit', month: 'long', year: 'numeric' }
    );

    const imagePath = press.image ? path.join(__dirname, '..', press.image) : null;
    const hasImage  = imagePath && fs.existsSync(imagePath);

    // Ensure /tmp folder exists
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    // Decode and save PDF
    const base64Data = pdfBase64.replace(/^data:application\/pdf;.*base64,/, '');
    const filePath   = path.join(tmpDir, `${Date.now()}_press.pdf`);
    await fs.promises.writeFile(filePath, base64Data, 'base64');

    // Build HTML email
    const footerLines = labels.footer.split('\n').join('<br>');
    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header banner -->
        <tr>
          <td style="background:#009d63;padding:18px 28px;">
            <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">${labels.header}</p>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:28px 28px 12px;">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#1a1a1a;line-height:1.3;">${emailTitle}</h1>
          </td>
        </tr>

        ${hasImage ? `
        <!-- Image: capped height so portrait images don't fill the screen -->
        <tr>
          <td style="padding:0 28px 20px;text-align:center;">
            <img src="cid:pressImage"
                 style="display:inline-block;width:auto;max-width:100%;max-height:380px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12);"
                 alt="${emailTitle}" />
          </td>
        </tr>` : ''}

        <!-- Content -->
        <tr>
          <td style="padding:0 28px 24px;font-size:15px;line-height:1.7;color:#444444;">
            ${emailContent}
          </td>
        </tr>

        <!-- Official footer -->
        <tr>
          <td style="padding:20px 28px 28px;border-top:2px solid #009d63;">
            <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">
              ${footerLines}<br>
              <strong>${dateStr}</strong>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `📢 ${emailTitle} – ${labels.subjectSuffix}`,
      text: `${labels.header}\n\n${emailTitle}\n\n${emailContent.replace(/<[^>]+>/g, '')}\n\n${labels.footer}\n${dateStr}`,
      html: htmlBody,
      attachments: [
        { filename: 'press-release.pdf', path: filePath, contentType: 'application/pdf' },
        ...(hasImage ? [{ filename: path.basename(imagePath), path: imagePath, cid: 'pressImage' }] : [])
      ]
    };

    transporter.sendMail(mailOptions, async (err) => {
      await fs.promises.unlink(filePath).catch(() => {});
      if (err) {
        console.error('❌ Email failed:', err);
        return res.status(500).json({ error: 'Email failed to send.', details: err.message });
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
