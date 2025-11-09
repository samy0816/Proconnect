# ProConnect 🚀

A modern, full-stack professional networking platform inspired by LinkedIn, built with cutting-edge technologies and powered by AI features.

![ProConnect](https://img.shields.io/badge/ProConnect-Professional%20Networking-0A66C2?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [AI Features](#ai-features)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure signup, login, and session management
- 👤 **User Profiles** - Customizable profiles with bio, work experience, and education
- 📝 **Posts & Feed** - Create, like, comment, and share posts with media support
- 💬 **Comments System** - Nested comments with real-time updates
- 🔗 **Networking** - Connect with other professionals and grow your network
- 📸 **Media Upload** - Support for images and videos in posts
- 🖼️ **Profile Pictures** - Upload and manage profile pictures

### AI-Powered Features 🤖
- ✍️ **AI Post Generator** - Generate professional posts using AI based on topics
- 💡 **AI Comment Suggestions** - Get intelligent comment suggestions for any post
- 📄 **Resume Download** - Generate and download professional resumes as PDF

### Modern UI/UX
- 🎨 Modern, clean, and responsive design
- 🌓 Consistent color scheme and styling
- 📱 Mobile-friendly interface
- ⚡ Fast page transitions and loading states

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.5.4](https://nextjs.org/) - React framework with SSR and routing
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) - Predictable state container
- **Styling**: CSS Modules - Component-scoped styling
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) - Popular icon library
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) - Client-side PDF generation

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **Framework**: [Express.js](https://expressjs.com/) - Web application framework
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database
- **ODM**: [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- **Authentication**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- **File Upload**: [Multer](https://github.com/expressjs/multer) - Multipart form data handling
- **AI Integration**: [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index) - AI model integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Hugging Face API Key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samy0816/Proconnect.git
   cd Proconnect
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   Create `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   HUGGING_FACE_API_KEY=your_hugging_face_api_key
   ```

4. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
ProConnect/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── ai.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   ├── models/               # Mongoose models
│   │   ├── user.model.js
│   │   ├── posts.model.js
│   │   ├── profile.model.js
│   │   ├── comments.model.js
│   │   └── connections.model.js
│   ├── routes/               # API routes
│   │   ├── ai.routes.js
│   │   ├── posts.routes.js
│   │   └── user.routes.js
│   ├── uploads/              # User uploaded files
│   └── server.js             # Express server entry point
│
├── frontend/
│   ├── public/               # Static assets
│   │   └── images/
│   ├── src/
│   │   ├── Components/       # Reusable components
│   │   │   ├── Navbar/
│   │   │   ├── AIPostGenerator/
│   │   │   └── AICommentSuggestions/
│   │   ├── config/           # Redux configuration
│   │   │   └── redux/
│   │   ├── layout/           # Layout components
│   │   │   ├── UserLayout/
│   │   │   └── DashboardLayout/
│   │   ├── pages/            # Next.js pages
│   │   │   ├── index.jsx     # Landing page
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── discover/
│   │   │   └── blog/
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Utility functions
│   └── package.json
│
└── README.md
```

## 🤖 AI Features

### 1. AI Post Generator
Powered by Hugging Face's language models, this feature helps users create engaging professional posts.

**How it works:**
- User provides a topic or keyword
- AI generates a complete, professional post
- User can edit or post directly

**Model Used:** Meta's Llama or similar large language models

### 2. AI Comment Suggestions
Generates contextual, professional comments based on post content.

**How it works:**
- Analyzes the post content
- Generates 3-5 relevant comment suggestions
- User can select and customize before posting

### 3. Resume Generator
Automatically creates professional PDF resumes from user profile data.

**Includes:**
- Contact information
- Professional summary
- Work experience
- Education
- Skills

## 🖼️ Screenshots

### Landing Page
Modern, professional landing page with clear call-to-action.

### Dashboard
Clean feed interface with post creation, AI features, and user interactions.

### Profile Page
Comprehensive profile view with editable sections for work experience and education.

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000                          # Server port
MONGODB_URI=                       # MongoDB connection string
HUGGING_FACE_API_KEY=              # Hugging Face API key for AI features
```

### Frontend (if needed)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000    # Backend API URL
```

## 📡 API Documentation

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile

### Posts
- `GET /api/posts/all` - Get all posts
- `POST /api/posts/create` - Create new post
- `POST /api/posts/like/:id` - Like a post
- `POST /api/posts/comment/:id` - Comment on a post
- `DELETE /api/posts/delete/:id` - Delete a post

### AI Features
- `POST /api/ai/generate-post` - Generate AI post
- `POST /api/ai/suggest-comments` - Get AI comment suggestions

### Profile
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/update` - Update profile
- `POST /api/users/profile/picture` - Upload profile picture

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samarth**
- GitHub: [@samy0816](https://github.com/samy0816)
- LinkedIn: [Connect with me](https://linkedin.com/in/samyishere)

## 🙏 Acknowledgments

- Hugging Face for AI model APIs
- Next.js team for the amazing framework
- MongoDB for the database solution
- All contributors and supporters

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue in the repository
- Contact via GitHub profile

---

**⭐ If you like this project, please give it a star on GitHub! ⭐**

Made with ❤️ by Samarth
