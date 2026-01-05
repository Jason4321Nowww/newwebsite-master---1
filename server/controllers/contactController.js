const Contact = require('../models/Contact');

const submitContact = async (req, res) =>{
        try {
            const {name, email, participation} = req.body;

            const contact = new Contact({name, email, participation});

            await contact.save();

            res.status(201).json({ success: true, message: 'Form submitted successfully.', contact:contact})
        } catch (error) {
           res.status(500).json({ success: false, message: 'Server error.', error: err.message });  
        }
}


const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};



module.exports = {submitContact, getContacts};