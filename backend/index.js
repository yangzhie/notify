require("dotenv").config()

const config = require("./config.json")
const mongoose = require("mongoose")
mongoose.connect(config.connectionString)
const User = require("./models/user.model")
const Note = require("./models/note.model")

const express = require('express');
const cors = require("cors")
const app = express()
const port = 8080

const jwt = require("jsonwebtoken")
const { authToken } = require("./utils")

// parses incoming JSON request bodies
app.use(express.json())

app.use(
    cors({
        origin: "*",
    })
)

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

    // search database for user profile -> gets email
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
    return res.json({error: false, user, accessToken, messsage: "Successfully registered."})
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

app.listen(port, () => {
    console.log("Server online.")
})