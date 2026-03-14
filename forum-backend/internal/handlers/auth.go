package handlers

import (
    "database/sql"
    "net/http"
    
    "github.com/gin-gonic/gin"
)

func Login(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var credentials struct {
            Username string `json:"username"`
        }

        if err := c.BindJSON(&credentials); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        if credentials.Username == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
            return
        }

        c.SetCookie(
            "username",
            credentials.Username,
            3600*24*7, 
            "/",
            "localhost",
            false,
            true,
        )

        c.JSON(http.StatusOK, gin.H{"username": credentials.Username})
    }
}

func Logout() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.SetCookie(
            "username",
            "",
            -1,
            "/",
            "localhost",
            false,
            true,
        )

        c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
    }
}