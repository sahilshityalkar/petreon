import { v4 as uuidv4 } from 'uuid';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: User;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Comment {
  id: string;
  post: string;
  author: User;
  text: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export const FALLBACK_USER: User = {
  id: 'fallback',
  name: 'Unknown User',
  username: 'unknown',
  avatar: '/placeholder-avatar.png'
}

const users: User[] = [
  { id: '1', username: 'max_lover', name: 'Max\'s Human', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', username: 'whiskers_forever', name: 'Whiskers Forever', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', username: 'buddy_pal', name: 'Buddy\'s Pal', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', username: 'current_user', name: 'Current User', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '5', username: 'paw_prints', name: 'Paw Prints', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '6', username: 'furry_friends', name: 'Furry Friends', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '7', username: 'pet_paradise', name: 'Pet Paradise', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '8', username: 'animal_lover', name: 'Animal Lover', avatar: 'https://i.pravatar.cc/150?img=7' },
];

let posts: Post[] = [
  {
    id: '1',
    author: users[0],
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    caption: 'Max enjoying his weekend at the park! 🐕 #DogLife #WeekendFun',
    likes: 42,
    comments: 5,
    createdAt: '2023-06-10T12:00:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '2',
    author: users[1],
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1686&q=80',
    caption: 'Caught in a sunbeam, living her best life 😺 #CatLife #Sunbathing',
    likes: 89,
    comments: 12,
    createdAt: '2023-06-09T15:30:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '3',
    author: users[2],
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    caption: 'Beach day with my best friend! 🏖️🐾 #BeachDay #DogFriends',
    likes: 65,
    comments: 8,
    createdAt: '2023-06-08T10:15:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '4',
    author: users[4],
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1915&q=80',
    caption: 'Lazy Sunday with my furry companion 🐱💤 #CatNap #SundayMood',
    likes: 53,
    comments: 6,
    createdAt: '2023-06-07T14:20:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '5',
    author: users[5],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    caption: 'Adventure time with my loyal hiking buddy! 🐕🏞️ #DogHike #NatureLover',
    likes: 78,
    comments: 9,
    createdAt: '2023-06-06T09:45:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '6',
    author: users[6],
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
    caption: 'That judgmental look... What did I do now? 😼 #CatAttitude #JudgmentalCat',
    likes: 102,
    comments: 15,
    createdAt: '2023-06-05T18:30:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '7',
    author: users[7],
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1792&q=80',
    caption: 'Best friends forever! 🐶🐱 #UnlikelyFriendship #PetLove',
    likes: 91,
    comments: 11,
    createdAt: '2023-06-04T11:10:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '8',
    author: users[3],
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80',
    caption: 'Morning cuddles with my favorite alarm clock 🐱⏰ #CatCuddles #MorningRoutine',
    likes: 67,
    comments: 7,
    createdAt: '2023-06-03T08:00:00Z',
    isLiked: false,
    isBookmarked: false,
  },
];

let comments: Comment[] = [
  {
    id: '1',
    post: '1',
    author: users[1],
    text: 'Such a happy pup! 🐕',
    createdAt: '2023-06-10T12:30:00Z',
    likes: 5,
    isLiked: false,
  },
  {
    id: '2',
    post: '1',
    author: users[2],
    text: 'Looks like a perfect day at the park!',
    createdAt: '2023-06-10T13:00:00Z',
    likes: 3,
    isLiked: false,
  },
  {
    id: '3',
    post: '2',
    author: users[3],
    text: 'I wish I could be as relaxed as this cat!',
    createdAt: '2023-06-09T16:00:00Z',
    likes: 7,
    isLiked: false,
  },
  {
    id: '4',
    post: '2',
    author: users[4],
    text: 'Sunbathing goals right here!',
    createdAt: '2023-06-09T16:30:00Z',
    likes: 4,
    isLiked: false,
  },
  {
    id: '5',
    post: '3',
    author: users[5],
    text: 'What a beautiful beach day! Your dog looks so happy!',
    createdAt: '2023-06-08T11:00:00Z',
    likes: 6,
    isLiked: false,
  },
];

// Ensure all posts and comments have valid user references
posts = posts.map(post => ({
  ...post,
  author: users.find(u => u.id === post.author.id) || FALLBACK_USER
}));

comments = comments.map(comment => ({
  ...comment,
  author: users.find(u => u.id === comment.author.id) || FALLBACK_USER
}));

export async function fetchPosts(page: number, limit: number): Promise<Post[]> {
  await delay(500);
  const start = (page - 1) * limit;
  const end = start + limit;
  return posts.slice(start, end);
}

export async function fetchPost(id: string): Promise<Post | undefined> {
  await delay(300);
  return posts.find(p => p.id === id);
}

export async function likePost(postId: string): Promise<{ success: boolean; likes: number; comments: number }> {
  await delay(300);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    post.isLiked = true;
    return { success: true, likes: post.likes, comments: post.comments };
  }
  return { success: false, likes: 0, comments: 0 };
}

export async function unlikePost(postId: string): Promise<{ success: boolean; likes: number; comments: number }> {
  await delay(300);
  const post = posts.find(p => p.id === postId);
  if (post && post.likes > 0) {
    post.likes -= 1;
    post.isLiked = false;
    return { success: true, likes: post.likes, comments: post.comments };
  }
  return { success: false, likes: 0, comments: 0 };
}

export async function bookmarkPost(postId: string): Promise<{ success: boolean }> {
  await delay(300);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isBookmarked = true;
    return { success: true };
  }
  return { success: false };
}

export async function unbookmarkPost(postId: string): Promise<{ success: boolean }> {
  await delay(300);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isBookmarked = false;
    return { success: true };
  }
  return { success: false };
}

export async function fetchComments(postId: string, page: number = 1, limit: number = 10): Promise<Comment[]> {
  await delay(500);
  return comments
    .filter(c => c.post === postId)
    .slice((page - 1) * limit, page * limit);
}

export async function addComment(postId: string, text: string): Promise<Comment> {
  await delay(300);
  const newComment: Comment = {
    id: uuidv4(),
    post: postId,
    author: users[3] || FALLBACK_USER, // Assuming current user
    text,
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
  };
  comments.push(newComment);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments += 1;
  }
  return newComment;
}

export async function likeComment(commentId: string): Promise<{ success: boolean; likes: number }> {
  await delay(300);
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.likes += 1;
    comment.isLiked = true;
    return { success: true, likes: comment.likes };
  }
  return { success: false, likes: 0 };
}

export async function unlikeComment(commentId: string): Promise<{ success: boolean; likes: number }> {
  await delay(300);
  const comment = comments.find(c => c.id === commentId);
  if (comment && comment.likes > 0) {
    comment.likes -= 1;
    comment.isLiked = false;
    return { success: true, likes: comment.likes };
  }
  return { success: false, likes: 0 };
}

export async function sharePost(postId: string): Promise<{ success: boolean; url: string }> {
  await delay(300);
  const post = posts.find(p => p.id === postId);
  if (post) {
    const shareUrl = `https://petreon.com/post/${postId}`;
    return { success: true, url: shareUrl };
  }
  return { success: false, url: '' };
}

export async function createPost(caption: string, image: string): Promise<Post> {
  await delay(500);
  const newPost: Post = {
    id: uuidv4(),
    author: users.find(u => u.id === '4') || FALLBACK_USER, // Assuming current user has id '4'
    image,
    caption,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    isLiked: false,
    isBookmarked: false,
  };
  posts.unshift(newPost);
  return newPost;
}