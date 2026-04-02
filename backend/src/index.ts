import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createBookRouter } from './routes/books';

// フェイルファスト: 起動時に GOOGLE_BOOKS_API_KEY の存在を確認する
const googleBooksApiKey = process.env['GOOGLE_BOOKS_API_KEY'];
if (!googleBooksApiKey) {
  console.error(
    'Error: GOOGLE_BOOKS_API_KEY が設定されていません。' +
      'backend/.env ファイルを作成し、APIキーを設定してください。' +
      '（backend/.env.example を参照）',
  );
  process.exit(1);
}

const app = express();
const port = parseInt(process.env['PORT'] ?? '3000', 10);

// CORS: フロントエンド開発サーバー (http://localhost:5173) からのリクエストを許可
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/books', createBookRouter(googleBooksApiKey));

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
