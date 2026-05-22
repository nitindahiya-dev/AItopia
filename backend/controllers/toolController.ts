// backend/controllers/toolController.ts
import type { Request, Response } from 'express';

export const getTools = (req: Request, res: Response) => {
  res.json([{ id: 1, name: 'BG Remove' }, { id: 2, name: 'Add Subtitle' }]);
}

export const createTool = (req: Request, res: Response) => {
  // Dummy create logic
  res.status(201).json({ message: 'Tool created', tool: req.body });
}