'use client';

import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  description: z.string(),
});

// this is the schema we want for our application
export const taskDTOSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  isDone: z.boolean(),
  createdAt: z.string().transform((str) => new Date(str)), // Convert string to Date
  updatedAt: z.string().transform((str) => new Date(str)), // Convert string to Date
});

export type TaskDTO = z.infer<typeof taskDTOSchema>;
