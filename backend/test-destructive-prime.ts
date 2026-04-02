// test-destructive-prime.ts
// 実行方法: cd backend && npx tsx test-destructive-prime.ts

import { searchBooks } from './src/services/bookService.js';

// ── モックデータ定義（手法Aと同一） ──────────────────────────

const mocks: Record<string, unknown> = {
  '正常データ': {
    totalItems: 1,
    items: [{ id: 'book001', volumeInfo: { title: 'JS入門', authors: ['著者A', '著者B'], publisher: '技術書院', publishedDate: '2024-01-01', description: 'テスト', imageLinks: { thumbnail: 'https://example.com/t.jpg' } } }],
  },
  'authorsがオブジェクト': {
    totalItems: 1,
    items: [{ id: 'book002', volumeInfo: { title: 'JS入門', authors: { 0: '著者A', 1: '著者B' }, publisher: null, publishedDate: null, description: null, imageLinks: null } }],
  },
  'itemsがオブジェクト': {
    totalItems: 1,
    items: { 0: { id: 'book003', volumeInfo: { title: 'test', authors: [], publisher: null, publishedDate: null, description: null, imageLinks: null } } },
  },
  'titleが数値': {
    totalItems: 1,
    items: [{ id: 'book004', volumeInfo: { title: 99999, authors: ['著者A'], publisher: null, publishedDate: null, description: null, imageLinks: null } }],
  },
  'idが存在しない': {
    totalItems: 1,
    items: [{ volumeInfo: { title: 'IDなし本', authors: ['著者A'], publisher: null, publishedDate: null, description: null, imageLinks: null } }],
  },
  'publisherがnull': {
    totalItems: 1,
    items: [{ id: 'book006', volumeInfo: { title: '出版社なし', authors: ['著者A'], publisher: null, publishedDate: '2024-01-01', description: 'テスト', imageLinks: null } }],
  },
};

// ── fetch をモックに差し替え ───────────────────────────────────

async function runTest(label: string, mockData: unknown) {
  // globalThis.fetch を一時的に差し替え
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    ({ ok: true, status: 200, statusText: 'OK', json: async () => mockData }) as Response;

  process.stdout.write(`\n【${label}】\n`);
  try {
    const result = await searchBooks('test', 'dummy-key');
    if (result.books.length === 0) {
      console.log(`  結果: books=[] (空配列)`);
    } else {
      const b = result.books[0];
      console.log(`  結果: 成功 → title="${b.title}" authors="${b.authors.join(', ')}"`);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  結果: クラッシュ → ${msg}`);
  } finally {
    globalThis.fetch = original;
  }
}

// ── 全テスト実行 ──────────────────────────────────────────────

console.log('\n========================================');
console.log('手法A\' 破壊的モックデータテスト');
console.log('========================================');

(async () => {
  for (const [label, mock] of Object.entries(mocks)) {
    await runTest(label, mock);
  }
  console.log('\n========================================\n');
})();