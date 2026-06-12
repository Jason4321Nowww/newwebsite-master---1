const express = require("express");
const router = express.Router();
const {
  createEmail, updateEmail, deleteEmail, getAllEmails, getEmail,
  addToList, removeFromList,
  getListNames, createList, deleteList, renameList, getEmailsByList
} = require("../controllers/emailController");

// ─── Mailing list management (specific routes before /:id) ───────────────────
router.get("/lists", getListNames);
router.post("/lists", createList);
router.patch("/lists/:name", renameList);
router.delete("/lists/:name", deleteList);

// ─── List membership ──────────────────────────────────────────────────────────
router.post("/add/:emailId", addToList);
router.post("/remove/:emailId", removeFromList);
router.get("/list/:listName", getEmailsByList);

// ─── Email CRUD ───────────────────────────────────────────────────────────────
router.post("/", createEmail);
router.get("/", getAllEmails);
router.put("/:id", updateEmail);
router.delete("/:id", deleteEmail);

module.exports = router;
