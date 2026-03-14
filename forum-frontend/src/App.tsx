import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TopicList from './components/TopicList';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentTopicId, setCurrentTopicId] = useState<number | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setCurrentUser(savedUsername);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTopicId(null);
    localStorage.removeItem('username');
  };

  const handleSelectTopic = (topicId: number) => {
    setCurrentTopicId(topicId);
  };

  const handleBackToTopics = () => {
    setCurrentTopicId(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onBackToTopics={handleBackToTopics}
        showBackButton={currentTopicId !== null}
      />
      <main className="container">
        <TopicList 
          currentUser={currentUser}
          selectedTopicId={currentTopicId}
          onSelectTopic={handleSelectTopic}
          onBackToTopics={handleBackToTopics}
        />
      </main>
    </div>
  );
}

export default App;