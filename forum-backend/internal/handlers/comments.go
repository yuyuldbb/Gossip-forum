package handlers

import (
    "database/sql"
    "forum-backend/internal/models"  
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
)

func GetComments(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        postId := c.Param("postId")

        rows, err := db.Query(
            "SELECT id, post_id, content, created_at, created_by FROM comments WHERE post_id = ? ORDER BY created_at ASC",
            postId,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer rows.Close()

        var comments []models.Comment
        for rows.Next() {
            var comment models.Comment
            err := rows.Scan(&comment.ID, &comment.PostID, &comment.Content, &comment.CreatedAt, &comment.CreatedBy)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            comments = append(comments, comment)
        }

        c.JSON(http.StatusOK, comments)
    }
}

func CreateComment(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        postId := c.Param("postId")
        var comment models.Comment
        if err := c.BindJSON(&comment); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        username := c.GetString("username")
        result, err := db.Exec(
            "INSERT INTO comments (post_id, content, created_by) VALUES (?, ?, ?)",
            postId, comment.Content, username,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        id, _ := result.LastInsertId()
        comment.ID = int(id)
        comment.PostID, _ = strconv.Atoi(postId)
        comment.CreatedBy = username

        c.JSON(http.StatusCreated, comment)
    }
}

func UpdateComment(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        var comment models.Comment
        if err := c.BindJSON(&comment); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        username := c.GetString("username")
        result, err := db.Exec(
            "UPDATE comments SET content = ? WHERE id = ? AND created_by = ?",
            comment.Content, id, username,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this comment"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Comment updated successfully"})
    }
}

func DeleteComment(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        username := c.GetString("username")

        result, err := db.Exec("DELETE FROM comments WHERE id = ? AND created_by = ?", id, username)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this comment"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
    }
}