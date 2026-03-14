package database

import (
    "database/sql"
   
    _ "modernc.org/sqlite" 
)

func InitDB() (*sql.DB, error) {

    db, err := sql.Open("sqlite", "./forum.db")
    if err != nil {
        return nil, err
    }

    
    if err = db.Ping(); err != nil {
        return nil, err
    }

   
    createTopicsTable := `
    CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT NOT NULL
    );`

    createPostsTable := `
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT NOT NULL,
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );`

    createCommentsTable := `
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );`

    _, err = db.Exec(createTopicsTable)
    if err != nil {
        return nil, err
    }

    _, err = db.Exec(createPostsTable)
    if err != nil {
        return nil, err
    }

    _, err = db.Exec(createCommentsTable)
    if err != nil {
        return nil, err
    }

    return db, nil
}