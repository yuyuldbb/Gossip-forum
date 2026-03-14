# Gossip Forum

A simple web forum built with Go backend and React TypeScript frontend.

## Features

- Username-based authentication (no password required)
- Create, read, update, and delete topics
- Create, read, update, and delete posts within topics
- Create, read, update, and delete comments on posts
- Users can only edit/delete their own content

## Tech Stack

### Backend
- Go with Gin framework
- SQLite database
- RESTful API architecture

### Frontend
- React with TypeScript
- Axios for API calls
- Basic CSS for styling


## Setup Instructions

### Prerequisites
- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
   cd forum-backend

2.Install dependencies:
      go mod tidy

3.Run the server:
    go run cmd/server/main.go

Server will start at http://localhost:8080

### Frontend Setup
1.Navigate to frontend folder:
    cd forum-frontend

2.Install dependencies:
    npm install

3.Start the development server:
    npm start

App will open at http://localhost:3000

### API endpoints

POST	/api/login	
POST	/api/logout	
GET	/api/topics	 
POST	/api/topics	 
PUT	/api/topics/:id 
DELETE	/api/topics/:id	 
GET	/api/topics/:topicId/posts	 
POST	/api/topics/:topicId/posts	 
PUT	/api/posts/:id	 
DELETE	/api/posts/:id	 
GET	/api/posts/:postId/comments	 
POST	/api/posts/:postId/comments	 
PUT	/api/comments/:id	 
DELETE	/api/comments/:id	 

### Usage Guide
Login – Open http://localhost:3000 and enter any username

Create a Topic – On the main page, enter a title and click "Create Topic"

View Posts – Click on any topic to see its posts

Create a Post – Inside a topic, fill in title and content, click "Create Post"

Add Comments – Click on a post to reveal the comment section, then write and submit

Edit/Delete – Buttons appear only on content you created
