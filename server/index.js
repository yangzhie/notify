require("dotenv").config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DB_URI)
const User = require("./models/user.model")
const Note = require("./models/note.model")

const express = require('express')
const cors = require("cors")
const app = express()
const port = 8080

app.use(
    cors({
        origin: ["https://notify-client-sigma.vercel.app"],
    })
)

const jwt = require("jsonwebtoken")
const { authToken } = require("./utils")

// parses incoming JSON request bodies
app.use(express.json())

app.get("/", (req, res) => {
    res.json({data: "hello"})
})

// sign up API
app.post("/create-account", async (req, res) => {
    // info coming from HTTP request's body from client
    const { fullName, email, password } = req.body

    // check if client-side is missing any fields
    if (!fullName) {
        return res.status(400).json({error: true, message: "Full name is required"})
    }

    if (!email) {
        return res.status(400).json({error: true, message: "Email is required"})
    }

    if (!password) {
        return res.status(400).json({error: true, message: "Password is required"})
    }

    // search the database for an existing user with the provided email address
    // can also be email instead of email: email
    //                                   DB  : input
    const isUser = await User.findOne({ email: email })
    
    // if user registers under same email, throw error
    if (isUser) {
        return res.json({error: true, message: "User already exists."})
    }

    // create new user in User DB with the properties from client
    const user = new User({ fullName, email, password })
    
    // save user in DB
    await user.save()

    // create access token for user 
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN, { expiresIn: "40000m" })
    
    // user created response 
    return res.json({error: false, user, accessToken, message: "Successfully registered."})
})

// login API
app.post("/login", async (req, res) => {
    // obtain HTTP data from client
    const { email, password } = req.body
    
    // check if client-side is missing any fields
    if (!email) {
        return res.status(400).json({error: true, message: "Email is required"})
    }

    if (!password) {
        return res.status(400).json({error: true, message: "Password is required"})
    }

    // search database for user profile -> gets email
    const userInfo = await User.findOne({ email: email })
    
    // if user registers under same email, throw error
    if (!userInfo) {
        return res.status(400).json({error: true, message: "User not found."})
    }

    // produce access token of certain user if login matches
    if (userInfo.email === email && userInfo.password === password) {
        const user = { user: userInfo }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
            expiresIn: "40000m"
        })

        return res.json({ error: false, message: "Login successful.", email, accessToken })
        
    } else {
        return res.status(400).json({error: true, message: "Invalid login ID."})
    }
})

// get user API
app.get("/get-user", authToken, async (req, res) => {
    // deconstruct user from token 
    const { user } = req.user
    
    // match MongoDB existing user : current user in schema
    const isUser = await User.findOne({ _id: user._id })
    
    if (!isUser) {
        return res.status(401)
    }

    return res.json({ user: isUser })
})

// add note API
app.post("/add-note", authToken, async (req, res) => {
    // data coming in from HTTP client side
    const { title, content, tags } = req.body
    // refers to the currently authenticated user when using JWT tokens
    const { user } = req.user
    
    // check if client-side is missing any fields
    if (!title) {
        return res.status(400).json({error: true, message: "A title is required"})
    }

    if (!content) {
        return res.status(400).json({error: true, message: "Some content is required"})
    }

    try {
        // create instance of Note model (record in DB)
        const note = new Note({
            title,
            content,
            // tags from req.body or empty array is there are none
            tags: tags || [],
            // assigns the userId field of note with the authenticated user's unique id (_id is from MongoDB)
            userId: user._id

        })

        // saves the note in DB
        await note.save()

        return res.json({ error: false, note, message: "Note created." })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal error." })
    }

})

// edit note API
app.put("/edit-note/:noteId", authToken, async (req, res) => {
    // noteId taken from params
    const noteId = req.params.noteId
    // user's inputs taken as HTTP request
    const { title, content, tags, isPinned } = req.body
    const { user } = req.user
    
    // if any of below are not altered
    if (!title && !content && !tags) {
        return res.status(400).json({error: true, message: "No changes provided."})
    }

    try {
        // finds the note to be edited in DB
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        
        // case: no note
        if (!note) {
            return res.status(400).json({error: true, message: "Note not found."})
        }

        // set user input to DB
        if (title) {
            // extract old title from note in DB and set it to new title
            note.title = title
        }

        if (content) {
            note.content = content
        }

        if (tags) {
            note.tags = tags
        }

        if (isPinned) {
            note.isPinned = isPinned
        }

        // save the note in DB
        await note.save()

        return res.json({error: false, note, message: "Successfully edited note."})
    } catch (error) {
        return res.status(500).json({error: true, message: "Internal error."})
    }
})

// get all notes API
app.get("/get-all-notes", authToken, async (req, res) => {
    const { user } = req.user
    
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 })
        
        return res.json({ error: false, notes, message: "All notes retrieved." })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal error." })
    }   
})

// delete note API
app.delete("/delete-note/:noteId", authToken, async (req, res) => {
    // noteId taken from params
    const noteId = req.params.noteId
    // refers to the currently authenticated user when using JWT tokens
    const { user } = req.user
    
    try {
        // use MongoDB library findOne to find a note that matches
        // 1. unique note's Id (mongoDB: client-side)
        // 2. user's Id (MongoDB schema: client-side Id) ensures the note belongs to that user
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        
        if (!note) {
            res.status(404).json({ error: true, message: "Note not found." })
        }

        await Note.deleteOne({ _id: noteId, userId: user._id })
        
        return res.json({ error: false, message: "Note deleted." })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal error." })
    }
})

// update isPinned API
app.put("/update-pinned/:noteId", authToken, async (req, res) => {
    const noteId = req.params.noteId
    const { isPinned } = req.body
    const { user } = req.user
    
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found." })
        }

        // property of MongoDB = user input
        note.isPinned = isPinned

        await note.save()

        return res.json({ error: false, note, message: "Note updated." })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal error" })
    }
})

// searching notes API
app.get("/search-notes", authToken, async (req, res) => {
    // verify user
    const { user } = req.user
    // query user input
    const { query } = req.query
    
    if (!query) {
        return res.status(400).json({error: true, message: "Search query is required"})
    }

    try {
        // using RegEX for finding notes
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                // matches against title
                { title: { $regex: new RegExp(query, "i") } },
                // matches against content
                { content: { $regex: new RegExp(query, "i") } }
            ]
        })

        return res.json({error: false, notes: matchingNotes, message: "Matching notes retrieved."})
    } catch (error) {
        return res.status(500).json({error: true, message: "Internal error."})
    }
})
    
app.listen(port, () => {
    console.log("Server online.")
})