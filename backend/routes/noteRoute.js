const express = require("express");
const {
    createNote,
    getNote,
    listNotes,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");
const {isAuthenticatedUser} = require("../middlewares/user_actions/auth");

const router = express.Router();

router.route("/").post(isAuthenticatedUser, createNote);
router.route("/:id").get(isAuthenticatedUser, getNote);
router.route("/").get(isAuthenticatedUser, listNotes);
router.route("/:id").put(isAuthenticatedUser, updateNote);
router.route("/:id").delete(isAuthenticatedUser, deleteNote);

module.exports = router;
