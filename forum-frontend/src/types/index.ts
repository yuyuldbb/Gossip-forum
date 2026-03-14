export interface User {
  username: string;
}

export interface Topic {
  id: number;
  title: string;
  createdAt: string;
  createdBy: string;
}

export interface Post {
  id: number;
  topicId: number;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
  createdBy: string;
}