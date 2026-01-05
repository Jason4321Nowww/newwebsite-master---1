const express = require("express");
const router = express.Router();
const { createEmail,
  updateEmail,
  deleteEmail,
  getAllEmails,
  getEmail,
  addToList,
  removeFromList,
  getListNames,
  getEmailsByList} = require("../controllers/emailController");

router.post("/", createEmail);
router.get("/", getAllEmails);
router.delete("/:id", deleteEmail);

router.post("/add/:emailId", addToList);
router.post("/remove/:emailId", removeFromList);

router.get("/lists", getListNames);
router.get("/list/:listName", getEmailsByList);

module.exports = router;
