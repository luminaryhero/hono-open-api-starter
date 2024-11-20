import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  bio: z.string().min(1).max(50).optional(),
  image: z.string().optional(),
  favorites: z.array(z.number()).optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const tagSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
});

export const taskSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(20),
  done: z.boolean(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const commentSchema = z.object({
  id: z.number(),
  body: z.string().min(1).max(100),
  userId: z.number(),
  articleId: z.number(),
  createdAt: z.date().nullable(),
});

export const articleSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(30),
  slug: z.string().min(1).max(30),
  description: z.string().min(1).max(50),
  authorId: z.number(),
  favored: z.boolean().default(false),
  comments: z.array(commentSchema).optional(),
  tags: z.array(tagSchema).optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const articleToTagSchema = z.object({
  articleId: z.number(),
  tagId: z.number(),
});
