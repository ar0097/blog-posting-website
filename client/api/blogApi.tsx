import api from "../api/api";
import {
  ApiResponse,
  CreateBlogPayload,
  GetBlogResponse,
  GetBlogsResponse,
} from "@/types/types";

export const getBlogs = async (): Promise<GetBlogsResponse> => {
  const response = await api.get<GetBlogsResponse>("/blogs");

  return response.data;
};

export const getBlogBySlug = async (slug: string): Promise<GetBlogResponse> => {
  const response = await api.get<GetBlogResponse>(`/blogs/${slug}`);
  return response.data;
};

export const createBlog = async (
  data: CreateBlogPayload,
): Promise<GetBlogResponse> => {
  const response = await api.post<GetBlogResponse>("/blogs", data);
  return response.data;
};

export const updateBlog = async (
  id: string,
  data: CreateBlogPayload,
): Promise<GetBlogResponse> => {
  const response = await api.put<GetBlogResponse>(`/blogs/${id}`, data);

  return response.data;
};

export const deleteBlog = async (id: string): Promise<ApiResponse> => {
  const response = await api.delete<ApiResponse>(`/blogs/${id}`);
  return response.data;
};

export const toggleLike = async (id: string) => {
  const response = await api.post(`/blogs/${id}/like`);
  return response.data;
};

export const addComment = async (id: string, comment: string) => {
  const response = await api.post(`/blogs/${id}/comment`, {
    comment,
  });

  return response.data;
};

export const incrementView = async (id: string) => {
  const response = await api.post(`/blogs/${id}/view`);
  return response.data;
};
