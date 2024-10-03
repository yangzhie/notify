# Notes App

A full-stack Notes application built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Next.js**. This app allows users to create, edit, delete, pin notes, and search through their notes for specific terms, features Toast notifications. Authentication is implemented for secure user access.

## Features

- **User Authentication**: Users can sign up and log in to manage their notes.
- **CRUD Operations**: Users can create, update, and delete notes.
- **Pinning Notes**: Pin important notes to prioritize them.
- **Search Functionality**: Users can search through their notes by keywords.
- **Responsive Design**: The app is responsive and works well across different devices.
  
## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## API Endpoints
### Authentication Routes:
- POST /create-account: Register a new user.
- POST /login: Log in a user.
- GET /get-user: Get a user.

### Note Routes:
- GET /get-all-notes: Get all notes for the logged-in user.
- POST /add-note: Create a new note.
- PUT /edit-note/:noteId: Update a note by ID.
- DELETE /delete-note/:noteId: Delete a note by ID.
- PUT /update-pinned/:noteId: Pin/unpin a note by ID.
- GET /search-notes: Seach notes of user by keyword.

## Screenshots
### Login Page
![login-page](/src/public/front-page.PNG)

### Register Page
![register-page](/src/public/register-page.PNG)

### Dashboard
![dashboard](/src/public/dashboard.PNG)

### Add Note Modal
![add-note](/src/public/add-note.PNG)

### Edit Note Modal
![edit-note](/src/public/edit-note.PNG)

### Search Notes
![search-notes](/src/public/search-notes.PNG)

## Future Improvements
- ~~fix up TypeScript components~~
- implement dark/light mode