# **Blog Application (Social Media Platform)**

A modern web application for managing user profiles, posts, and comments. This application allows users to create and manage their profiles, add posts, and interact with other users through comments.

## Features

- User authentication (sign up, log in, log out)
- Profile management (edit profile, upload profile pictures)
- Post creation (add, edit, delete posts with images)
- Commenting on posts (add, edit, delete comments)
- Responsive design for a seamless experience across devices

## Technologies Used

- **Frontend:** HTML, CSS, Bootstrap, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Passport.js

## Installation

### Prerequisites

- Node.js
- MongoDB

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RiyaDv/Blog-Application.git
   cd Blog-Application
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
   MONGODB_URI=YOU_MONGOBD_CONNECTION_URL
   SESSION_SECRET=your_session_secret
   ```

4. **Run the application:**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## Usage

- **Sign Up:** Register a new account with a username, email, and password.
- **Log In:** Access your account using your credentials.
- **Edit Profile:** Update your profile information and upload a new profile picture.
- **Add Post:** Create a new post with a title, content, and optional images.
- **Edit Post:** Modify your existing posts.
- **Comment on Posts:** Add, edit, or delete comments on posts.

## Folder Structure

```
social-media-platform/
│
├── config/                  # Configuration files
|   └── cloudinary.js        # Cloudinary configuration
|   └── multer.js            # Multer configuration
│   └── passport.js          # Passport.js authentication configuration
│
├── models/                  # Mongoose models
│   ├── User.js              # User model
│   ├── Post.js              # Post model
|   └── File.js              # File model (for Images)
│   └── Comment.js           # Comment model
│
├── routes/                  # Express routes
│   ├── authRoute.js         # Authentication routes
│   ├── postRoutes.js        # Post routes
│   ├── userRoute.js         # User routes
│   └── commentRoute.js      # Comment routes
│
├── views/                   # EJS templates
│   ├── partials/            # Partials like header and footer
│   │   ├── header.ejs       # Header template
│   │   ├── footer.ejs       # Footer template
│   ├── editComment.ejs      # Comment Modification Page
│   ├── editPost.ejs         # Post Modification Page
│   ├── posts.ejs            # All Posts page
│   ├── home.ejs             # Home page
│   ├── login.ejs            # Login page
│   ├── register.ejs         # Registration page
│   ├── editProfile.ejs      # Edit profile page
│   ├── postDetails.ejs      # Single Post view page
│   ├── newPost.ejs          # Add post page
│   ├── profile.ejs          # User Profile page
│   └── error.ejs            # Error page
│
├── .env                     # Environment variables
├── package.json             # NPM dependencies and scripts
└── app.js                   # Main server file
```

## Acknowledgments

- Bootstrap for responsive design
- FontAwesome for icons
- The Express and MongoDB communities
