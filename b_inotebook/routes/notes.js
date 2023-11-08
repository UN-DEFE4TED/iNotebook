const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


const router = express.Router();

router.get('/getallnotes', fetchUser, async (req, res)=>{
    const { user } = req;
    const notes = await Notes.find({ user });

    res.status(200).json({ total:notes.length, notes })
});

router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be alteast 5 characters').isLength({ min: 5 })
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){ return res.status(400).json({ errors: errors.array() }) };
    try {
        const { title, description, tag } = req.body;
        const note = await Notes.create({ title, description, tag, user: req.user});

        res.status(200).json(note)
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message:  err.message
        });
    };
});

router.put('/updatenote/:id', fetchUser, async (req, res)=>{
    const { title, description, tag } = req.body;
    const newNote = {};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    try {
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send('Not Found')};
        if(note.user.toString()!==req.user){return res.status(404).send('Not Found....')};
    
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.status(200).json(note)
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message:  err.message
        });
    };
});

router.delete('/deletenote/:id', fetchUser, async (req, res)=>{
    try {
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send('Not Found')};

        if(note.user.toString()!==req.user){return res.status(404).send('Not Found....')};
    
        note = await Notes.findByIdAndDelete(req.params.id);
        res.status(200).json({ "success": "note deleted", note })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message:  err.message
        });
    };
});


module.exports = router;