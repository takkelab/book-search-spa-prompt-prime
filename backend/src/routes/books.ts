import { Router } from 'express';
import type { Request, Response } from 'express';
import { searchBooks } from '../services/bookService';

export function createBookRouter(apiKey: string): Router {
  const router = Router();

  router.get('/search', async (req: Request, res: Response): Promise<void> => {
    const q = req.query['q'];

    if (typeof q !== 'string' || q.trim() === '') {
      res.status(400).json({ error: 'q パラメータは必須です' });
      return;
    }

    try {
      const result = await searchBooks(q.trim(), apiKey);
      res.json(result);
    } catch (err) {
      console.error('Error in GET /api/books/search:', err);
      res.status(500).json({ error: 'Google Books API へのリクエストに失敗しました' });
    }
  });

  return router;
}
