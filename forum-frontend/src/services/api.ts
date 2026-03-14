import axios from 'axios';
import { Topic, Post, Comment } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

     
    this.api.interceptors.request.use(
      (config) => {
        const username = localStorage.getItem('username');
        if (username) {
          config.headers['X-Username'] = username;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

     
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url, response.data);
        return response;
      },
      (error) => {
        console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
        return Promise.reject(error);
      }
    );
  }

   
  async login(username: string): Promise<{ username: string }> {
    const response = await this.api.post('/login', { username });
    if (response.data.username) {
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
    localStorage.removeItem('username');
  }
 
  async getTopics(): Promise<Topic[]> {
    const response = await this.api.get('/topics');
    return response.data;
  }

  async createTopic(title: string): Promise<Topic> {
    const response = await this.api.post('/topics', { title });
    return response.data;
  }

  async updateTopic(id: number, title: string): Promise<void> {
    await this.api.put(`/topics/${id}`, { title });
  }

  async deleteTopic(id: number): Promise<void> {
    await this.api.delete(`/topics/${id}`);
  }
 
  async getPosts(topicId: number): Promise<Post[]> {
    const response = await this.api.get(`/topics/${topicId}/posts`);
    return response.data;
  }

  async createPost(topicId: number, title: string, content: string): Promise<Post> {
    const response = await this.api.post(`/topics/${topicId}/posts`, { 
      title, 
      content 
    });
    return response.data;
  }

  async updatePost(id: number, title: string, content: string): Promise<void> {
    await this.api.put(`/posts/${id}`, { title, content });
  }

  async deletePost(id: number): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }
 
  async getComments(postId: number): Promise<Comment[]> {
    const response = await this.api.get(`/posts/${postId}/comments`);
    return response.data;
  }

  async createComment(postId: number, content: string): Promise<Comment> {
    const response = await this.api.post(`/posts/${postId}/comments`, { 
      content 
    });
    return response.data;
  }

  async updateComment(id: number, content: string): Promise<void> {
    await this.api.put(`/comments/${id}`, { content });
  }

  async deleteComment(id: number): Promise<void> {
    await this.api.delete(`/comments/${id}`);
  }
}

 
const apiService = new ApiService();
export default apiService;