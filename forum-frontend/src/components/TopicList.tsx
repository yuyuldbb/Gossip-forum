import React, { useState, useEffect, useCallback } from 'react';
import PostList from './PostList';
import { Topic } from '../types';
import apiService from '../services/api';

interface TopicListProps {
  currentUser: string;
  selectedTopicId: number | null;
  onSelectTopic: (topicId: number) => void;
  onBackToTopics?: () => void;
}

const TopicList: React.FC<TopicListProps> = ({ 
  currentUser, 
  selectedTopicId, 
  onSelectTopic,
  onBackToTopics 
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [editingTopic, setEditingTopic] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getTopics();
      setTopics(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch topics');
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) {
      setError('Topic title is required');
      return;
    }

    try {
      await apiService.createTopic(newTopicTitle);
      setNewTopicTitle('');
      fetchTopics();
    } catch (err: any) {
      setError('Failed to create topic');
    }
  };

  const handleUpdateTopic = async (id: number) => {
    if (!editTitle.trim()) return;

    try {
      await apiService.updateTopic(id, editTitle);
      setEditingTopic(null);
      fetchTopics();
    } catch (err: any) {
      setError('Failed to update topic');
    }
  };

  const handleDeleteTopic = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this topic? This will delete all posts and comments in this topic.')) return;

    try {
      await apiService.deleteTopic(id);
      fetchTopics();
    } catch (err: any) {
      setError('Failed to delete topic');
    }
  };

  
if (selectedTopicId) {
  return (
    <PostList 
      topicId={selectedTopicId} 
      currentUser={currentUser}
      onBackToTopics={onBackToTopics}
    />
  );
}
  return (
    <div className="topic-list">
      <h2>Topics</h2>
      
      <form onSubmit={handleCreateTopic} className="create-form">
        <input
          type="text"
          placeholder="New topic title"
          value={newTopicTitle}
          onChange={(e) => setNewTopicTitle(e.target.value)}
        />
        <button type="submit">Create Topic</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading topics...</div>}

      <div className="topics">
        {topics.length === 0 && !loading && (
          <p className="no-topics">No topics yet. Create the first topic!</p>
        )}
        {topics.map((topic) => (
          <div key={topic.id} className="topic-item">
            {editingTopic === topic.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <div className="edit-actions">
                  <button onClick={() => handleUpdateTopic(topic.id)}>Save</button>
                  <button onClick={() => setEditingTopic(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className="topic-content"
                  onClick={() => onSelectTopic(topic.id)}
                >
                  <h3>{topic.title}</h3>
                  <small>
                    Created by {topic.createdBy} on {new Date(topic.createdAt).toLocaleDateString()}
                  </small>
                </div>
                {topic.createdBy === currentUser && (
                  <div className="topic-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTopic(topic.id);
                        setEditTitle(topic.title);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTopic(topic.id);
                      }}
                    >
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

export default TopicList;