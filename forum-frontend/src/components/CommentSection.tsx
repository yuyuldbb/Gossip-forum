import React, { useState, useEffect, useCallback } from 'react';
import { Comment } from '../types';
import apiService from '../services/api';

interface CommentSectionProps {
  postId: number;
  currentUser: string;
  onBack: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUser, onBack }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getComments(postId);
      setComments(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Comment content is required');
      return;
    }

    try {
      await apiService.createComment(postId, newComment);
      setNewComment('');
      fetchComments();
    } catch (err: any) {
      setError('Failed to create comment');
    }
  };

  const handleUpdateComment = async (id: number) => {
    if (!editContent.trim()) return;

    try {
      await apiService.updateComment(id, editContent);
      setEditingComment(null);
      fetchComments();
    } catch (err: any) {
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await apiService.deleteComment(id);
      fetchComments();
    } catch (err: any) {
      setError('Failed to delete comment');
    }
  };

  return (
    <div className="comment-section">
      <button onClick={onBack} className="back-button">
        ← Back to Posts
      </button>
      
      <h3>Comments</h3>
      
      <form onSubmit={handleCreateComment} className="create-form">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button type="submit">Add Comment</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading comments...</div>}

      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            {editingComment === comment.id ? (
              <div className="edit-form">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                />
                <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
                <button onClick={() => setEditingComment(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <small>
                    {comment.createdBy} - {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
                {comment.createdBy === currentUser && (
                  <div className="comment-actions">
                    <button 
                      onClick={() => {
                        setEditingComment(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
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

export default CommentSection;