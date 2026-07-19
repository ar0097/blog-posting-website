export interface Author {
  name: string;
  bio: string;
  avatar: string;
}

export interface BlogContent {
  _id: string;
  heading: string;
  content: string;
}

export interface BlogComment {
  _id: string;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

export interface Blog {
  author: Author;
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: BlogContent[];
  thumbnail: string;
  banner: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  schemaMarkup: string;
  tags: string[];
  category: string;
  views: number;
  likes: string[]; 
  comments: BlogComment[]; 
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetBlogsResponse {
  message: boolean;
  count: number;
  blogs: Blog[];
}

export interface GetBlogResponse {
  message: boolean;
  blog: Blog;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CreateBlogPayload {
  author: Author;
  title: string;
  slug: string;
  description: string;
  content: BlogContent[];
  thumbnail: string;
  banner: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  schemaMarkup: string;
  tags: string[];
  category: string;
}
