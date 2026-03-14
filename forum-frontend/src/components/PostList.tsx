import React, { useState, useEffect, useCallback } from 'react';
import CommentSection from './CommentSection';
import { Post } from '../types';
import apiService from '../services/api';

interface PostListProps {
  topicId: number;
  currentUser: string;
  onBackToTopics?: () => void;
}

const PostList: React.FC<PostListProps> = ({ topicId, currentUser, onBackToTopics }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null); // For showing comments
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getPosts(topicId);
      setPosts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      await apiService.createPost(topicId, newPostTitle, newPostContent);
      setNewPostTitle('');
      setNewPostContent('');
      fetchPosts();
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const handleUpdatePost = async (id: number) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      await apiService.updatePost(id, editTitle, editContent);
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      console.error('Error updating post:', err);
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post? This will delete all comments.')) return;

    try {
      await apiService.deletePost(id);
      if (selectedPostId === id) {
        setSelectedPostId(null); // Close comments if the post was deleted
      }
      fetchPosts();
    } catch (err: any) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  const handlePostClick = (postId: number) => {
    // Toggle comments - if same post, close it; if different post, open it
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h2>Posts</h2>
        {onBackToTopics && (
          <button onClick={onBackToTopics} className="back-button">
            ← Back to Topics
          </button>
        )}
      </div>
      
      <form onSubmit={handleCreatePost} className="create-form">
        <input
          type="text"
          placeholder="Post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Post content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          rows={4}
        />
        <button type="submit">Create Post</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading posts...</div>}

      <div className="posts">
        {!loading && posts.length === 0 && (
          <p className="no-posts">No posts yet. Create the first post!</p>
        )}
        {posts.map((post) => (
          <div key={post.id}
           className={`post-item ${selectedPostId === post.id ? 'selected' : ''}`}>
            {editingPost === post.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                />
                <div className="edit-actions">
                  <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                  <button onClick={() => setEditingPost(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className="post-content"
                  onClick={() => handlePostClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <small>
                    Created by {post.createdBy} on {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </div>
                {post.createdBy === currentUser && (
                  <div className="post-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPost(post.id);
                        setEditTitle(post.title);
                        setEditContent(post.content);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
                
            
                {selectedPostId === post.id && (
                  <div className="post-comments">
                    <CommentSection 
                      postId={post.id} 
                      currentUser={currentUser}
                      onBack={() => setSelectedPostId(null)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;