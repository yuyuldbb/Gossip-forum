package handlers

import (
    "database/sql"
    "forum-backend/internal/models"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
)

func GetPosts(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        topicId := c.Param("topicId")

        rows, err := db.Query(
            "SELECT id, topic_id, title, content, created_at, created_by FROM posts WHERE topic_id = ? ORDER BY created_at DESC",
            topicId,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer rows.Close()

        var posts []models.Post
        for rows.Next() {
            var post models.Post
            err := rows.Scan(&post.ID, &post.TopicID, &post.Title, &post.Content, &post.CreatedAt, &post.CreatedBy)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            posts = append(posts, post)
        }

        c.JSON(http.StatusOK, posts)
    }
}

func CreatePost(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        topicId := c.Param("topicId")
        var post models.Post
        if err := c.BindJSON(&post); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        username := c.GetString("username")
        result, err := db.Exec(
            "INSERT INTO posts (topic_id, title, content, created_by) VALUES (?, ?, ?, ?)",
            topicId, post.Title, post.Content, username,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        id, _ := result.LastInsertId()
        post.ID = int(id)
        post.TopicID, _ = strconv.Atoi(topicId)
        post.CreatedBy = username

        c.JSON(http.StatusCreated, post)
    }
}

func UpdatePost(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        var post models.Post
        if err := c.BindJSON(&post); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        username := c.GetString("username")
        result, err := db.Exec(
            "UPDATE posts SET title = ?, content = ? WHERE id = ? AND created_by = ?",
            post.Title, post.Content, id, username,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this post"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Post updated successfully"})
    }
}

func DeletePost(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        username := c.GetString("username")

        result, err := db.Exec("DELETE FROM posts WHERE id = ? AND created_by = ?", id, username)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this post"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
    }
}