package handlers

import (
    "database/sql"
    "forum-backend/internal/models"
    "net/http"
    

    "github.com/gin-gonic/gin"
)

func GetTopics(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        rows, err := db.Query("SELECT id, title, created_at, created_by FROM topics ORDER BY created_at DESC")
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer rows.Close()

        var topics []models.Topic
        for rows.Next() {
            var topic models.Topic
            err := rows.Scan(&topic.ID, &topic.Title, &topic.CreatedAt, &topic.CreatedBy)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            topics = append(topics, topic)
        }

        c.JSON(http.StatusOK, topics)
    }
}

func CreateTopic(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var topic models.Topic
        if err := c.BindJSON(&topic); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        username := c.GetString("username")
        result, err := db.Exec(
            "INSERT INTO topics (title, created_by) VALUES (?, ?)",
            topic.Title, username,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        id, _ := result.LastInsertId()
        topic.ID = int(id)
        topic.CreatedBy = username

        c.JSON(http.StatusCreated, topic)
    }
}

func UpdateTopic(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        var topic models.Topic
        if err := c.BindJSON(&topic); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        username := c.GetString("username")
        result, err := db.Exec(
            "UPDATE topics SET title = ? WHERE id = ? AND created_by = ?",
            topic.Title, id, username,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this topic"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Topic updated successfully"})
    }
}

func DeleteTopic(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        username := c.GetString("username")

        result, err := db.Exec("DELETE FROM topics WHERE id = ? AND created_by = ?", id, username)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this topic"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Topic deleted successfully"})
    }
}