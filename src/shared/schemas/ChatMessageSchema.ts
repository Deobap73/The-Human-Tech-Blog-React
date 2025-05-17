// src/shared/schemas/ChatMessageSchema.ts
import { z } from 'zod';

const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'user']).default('user'),
  avatar: z.string().optional(),
});

export const ChatMessageSchema = z.object({
  _id: z.string(),
  conversationId: z.string(),
  text: z.string(),
  sender: z.union([z.string(), UserSchema]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
