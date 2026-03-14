package main

import (
    "log"

    "forum-backend/internal/database"
    "forum-backend/internal/handlers"
    "forum-backend/internal/middleware"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
   
    db, err := database.InitDB()
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    defer db.Close()

 
    router := gin.Default()

    
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"}
    config.AllowCredentials = true
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Username"}
    router.Use(cors.New(config))


    api := router.Group("/api")
    {
        
        api.POST("/login", handlers.Login(db))
        api.POST("/logout", handlers.Logout())

     
        api.GET("/topics", handlers.GetTopics(db))
        api.POST("/topics", middleware.AuthRequired(), handlers.CreateTopic(db))
        api.PUT("/topics/:id", middleware.AuthRequired(), handlers.UpdateTopic(db))
        api.DELETE("/topics/:id", middleware.AuthRequired(), handlers.DeleteTopic(db))

        
        api.GET("/topics/:topicId/posts", handlers.GetPosts(db))
        api.POST("/topics/:topicId/posts", middleware.AuthRequired(), handlers.CreatePost(db))
        api.PUT("/posts/:id", middleware.AuthRequired(), handlers.UpdatePost(db))
        api.DELETE("/posts/:id", middleware.AuthRequired(), handlers.DeletePost(db))

       
        api.GET("/posts/:postId/comments", handlers.GetComments(db))
        api.POST("/posts/:postId/comments", middleware.AuthRequired(), handlers.CreateComment(db))
        api.PUT("/comments/:id", middleware.AuthRequired(), handlers.UpdateComment(db))
        api.DELETE("/comments/:id", middleware.AuthRequired(), handlers.DeleteComment(db))
    }

    log.Println("Server starting on http://localhost:8080")
    router.Run(":8080")
}