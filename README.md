This project implements the backend for a video uploading website built with Node.js and MongoDB. It offers functionalities for user management, video management, and various user interactions.

**Note**
Code implemented using the course material provided by the course - Backend Development by Hitesh Choudary (https://www.youtube.com/@chaiaurcode)

**Features**

**User Management:**

1. User registration with email and password.

2. Login and logout with JWT (JSON Web Token) based authentication.
3. User profile management including avatar and cover image upload.
4. User information update and delete

**Social Features (using MongoDB Aggregation):**

1. Track watch history for users.
2. Manage user subscriptions (follow/unfollow).

3. Add videos to playlist.

**Dependencies:**

1. Node.js and npm.

2. MongoDB.

(please check package.json for further dependencies)

**Important concepts implemented:**

1. User authentication using JWT.

2. Handling the upload of images and videos using cloudinary.

3. Tracking watch history and subscriber count using mongodb aggregation pipelines
