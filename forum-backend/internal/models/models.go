package models

import "time"

type User struct {
    Username string `json:"username"`
}

type Topic struct {
    ID        int       `json:"id"`
    Title     string    `json:"title"`
    CreatedAt time.Time `json:"createdAt"`
    CreatedBy string    `json:"createdBy"`
}

type Post struct {
    ID        int       `json:"id"`
    TopicID   int       `json:"topicId"`
    Title     string    `json:"title"`
    Content   string    `json:"content"`
    CreatedAt time.Time `json:"createdAt"`
    CreatedBy string    `json:"createdBy"`
}

type Comment struct {
    ID        int       `json:"id"`
    PostID    int       `json:"postId"`
    Content   string    `json:"content"`
    CreatedAt time.Time `json:"createdAt"`
    CreatedBy string    `json:"createdBy"`
}