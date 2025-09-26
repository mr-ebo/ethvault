const {z} = require("zod");
const Note = require("../models/noteModel");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");

const noteZodSchema = z.object({
    title: z.string().min(3).trim(),
    content: z.string().min(3).trim(),
});

exports.createNote = asyncErrorHandler(async (req, res) => {
    const note = await Note.create({...req.validatedBody, user: req.user.id});
    res.status(201).json({
        success: true,
        id: note._id,
    });
}, noteZodSchema);

exports.getNote = asyncErrorHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).json({
            success: false,
            error: "Note not found",
        });
    }
    res.status(200).json({
        success: true,
        note,
    });
});

exports.listNotes = asyncErrorHandler(async (req, res) => {
    const notes = await Note.find({});
    res.status(200).json({
        success: true,
        notes,
    });
});

exports.updateNote = asyncErrorHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).json({
            success: false,
            error: "Note not found",
        });
    }
    note.title = req.validatedBody.title;
    note.content = req.validatedBody.content;
    await note.save(note)
    res.status(204).json({
        success: true,
    });
}, noteZodSchema);

exports.deleteNote = asyncErrorHandler(async (req, res) => {
    const {_, deletedCount} = await Note.deleteOne({_id: req.params.id});
    if (deletedCount === 1) {
        res.status(204).json({
            success: true,
        });
    } else {
        return res.status(404).json({
            success: false,
        });
    }
});
