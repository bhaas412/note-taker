// Include necessary modules
const router = require('express').Router();
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

// Get promise-based version of readFile and writeFile 
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

//#region Helper functions for reading/writing from/to db.json

// This function gets all notes from db.json and returns them
const getAllNotes = async () => {
    const notes = await readFromFile('db/db.json', 'utf8');

    let allNotes = [];

    try {
        allNotes = allNotes.concat(JSON.parse(notes));
    } catch (e) {
    }

    return allNotes;
}

// This function adds a note to db.json and returns the new note
const addNote = async (note) => {
    // Destructure req.body object
    const { title, text } = note;

    // Check to see if title or text is empty
    if (!title || !text) {
        throw new Error("Note needs a title and cannot be blank");
    }

    // Generate a unique id using uuid
    const newNote = { title, text, id: uuidv4() };

    // Get all notes before adding the new note to the existing notes and then writing the new notes to db.json
    const allNotes = await getAllNotes();
    const newNotes =  await [...allNotes, newNote];

    return await writeToFile('db/db.json', JSON.stringify(newNotes));
}

//#endregion

// GET /api/notes should read the db.json file and return all saved notes to the client
router.get('/notes', async (req, res) => {
    const allNotes = await getAllNotes();
    try {
        return res.json(allNotes);
    } catch (e) {
        return res.status(500).json(e);
    }
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
router.post('/notes', async (req, res) => {
    const note = await addNote(req.body);
    try {
        return res.json(note);
    } catch (e) {
        return res.status(500).json(e);
    }
})

module.exports = router;