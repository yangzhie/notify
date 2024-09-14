require("dotenv").config()

const config = require("./config.json")
const mongoose = require("mongoose")

mongoose.connect(config.connectionString)

const User = require("./models/user.model")

const express = require('express');
const cors = require("cors")
const app = express()
const port = 8080

const jwt = require("jsonwebtoken")
const { authToken } = require("./utils")

app.use(express.json())

app.use(
    cors({
        origin: "*",
    })
)

app.get("/", (req, res) => {
    res.json({data: "hello"})
})

// create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName) {
        return res.status(400).json({error: true, message: "Full name is required"})
    }

    if (!email) {
        return res.status(400).json({error: true, message: "Email is required"})
    }

    if (!password) {
        return res.status(400).json({error: true, message: "Password is required"})
    }

    const isUser = await User.findOne({ email: email })
    
    if (isUser) {
        return res.json({error: true, message: "User already exists."})
    }

    const user = new User({ fullName, email, password })
    
    await user.save()

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN, { expiresIn: "40000m" })
    
    return res.json({error: false, user, accessToken, messsage: "Successfully registered."})
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    
    if (!email) {
        return res.status(400).json({error: true, message: "Email is required"})
    }

    if (!password) {
        return res.status(400).json({error: true, message: "Password is required"})
    }

    const userInfo = await User.findOne({ email: email })
    
    if (!userInfo) {
        return res.status(400).json({error: true, message: "User not found."})
    }

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

app.listen(port, () => {
    console.log("Server online.")
})