# Backend API

A scalable backend built with Node.js, Express.js, MongoDB, and Mongoose. This project provides APIs for user authentication, video management, subscriptions, comments, playlists, likes, watch history, and channel management.

## Features

- User Authentication & Authorization
  - JWT Access Token
  - Refresh Token
  - Secure Cookie Authentication

- User Management
  - Register User
  - Login User
  - Logout User
  - Update Profile
  - Update Avatar
  - Update Cover Image
  - Change Password

- Video Management
  - Upload Videos
  - Update Videos
  - Delete Videos
  - Publish/Unpublish Videos
  - Get Video Details

- Channel Features
  - User Channel Profile
  - Subscriber Count
  - Subscribed Channels
  - Channel Statistics

- Comments
  - Add Comment
  - Update Comment
  - Delete Comment
  - Fetch Comments

- Playlists
  - Create Playlist
  - Update Playlist
  - Delete Playlist
  - Add Videos to Playlist

- Likes
  - Like Video
  - Like Comment
  - Remove Like

- Watch History
  - Store Watch History
  - Fetch Watch History

- Advanced MongoDB Aggregation Pipelines

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Multer
- Bcrypt
- Cookie Parser

## Project Structure

```bash
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
├── services/
└── app.js
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run Project

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

## API Endpoints

### User

- POST `/api/v1/users/register`
- POST `/api/v1/users/login`
- POST `/api/v1/users/logout`
- POST `/api/v1/users/refresh-token`
- GET `/api/v1/users/current-user`

### Videos

- POST `/api/v1/videos`
- GET `/api/v1/videos/:id`
- PATCH `/api/v1/videos/:id`
- DELETE `/api/v1/videos/:id`

### Comments

- POST `/api/v1/comments`
- GET `/api/v1/comments/:videoId`
- PATCH `/api/v1/comments/:commentId`
- DELETE `/api/v1/comments/:commentId`

### Playlists

- POST `/api/v1/playlists`
- GET `/api/v1/playlists/:id`
- PATCH `/api/v1/playlists/:id`
- DELETE `/api/v1/playlists/:id`

## Authentication

Protected routes require a valid Access Token.

```http
Authorization: Bearer <token>
```

## Database

MongoDB is used as the primary database.

Mongoose is used for:

- Schema Design
- Data Validation
- Aggregation Pipelines
- Relationships & References

## Future Improvements

- Notifications
- Video Recommendations
- Search Optimization
- Real-Time Chat
- Live Streaming Support

## Author

Nehru Sharma

## License

This project is licensed under the MIT License.