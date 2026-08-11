import {
  getAllCommentsForPost,
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
} from '../../src/api/comments.js';

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const mockComments = [
  { id: '1', content: 'First comment' },
  { id: '2', content: 'Second comment' },
];

const server = setupServer(
  // GET all comments
  http.get('http://localhost/posts/123/comments', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');

    if (page && pageSize) {
      const p = Number(page);
      const ps = Number(pageSize);
      const paginated = mockComments.slice((p - 1) * ps, p * ps);
      return HttpResponse.json({
        data: paginated,
        total: mockComments.length,
        page: p,
        pageSize: ps,
      });
    }

    return HttpResponse.json(mockComments);
  }),


  // POST create comment
  http.post('http://localhost/posts/123/comments', async ({ request }) => {
    const body = (await request.json()) as { content: string };
    return HttpResponse.json({ id: '3', content: body.content });
  }),


  // PATCH update comment
  http.patch('http://localhost/posts/123/comments/1', async ({ request }) => {
    const body = (await request.json()) as { content: string };
    return HttpResponse.json({ id: '1', content: body.content });
  }),

  // DELETE comment
  http.delete('http://localhost/posts/123/comments/1', () => {
    return HttpResponse.json({ success: true });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('comments API', () => {
  it('fetches all comments for a post', async () => {
    const result = await getAllCommentsForPost('123');
    expect(result).toHaveLength(2);
    expect(result[0].content).toBe('First comment');
  });

  it('fetches paginated comments', async () => {
    const result = await getCommentsForPost('123', 1, 1);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(2);
  });

  it('creates a new comment', async () => {
    const result = await createComment('123', { content: 'New comment' });
    expect(result.content).toBe('New comment');
    expect(result.id).toBe('3');
  });

  it('updates a comment', async () => {
    const result = await updateComment('123', '1', { content: 'Updated comment' });
    expect(result.content).toBe('Updated comment');
  });

  it('deletes a comment', async () => {
    const result = await deleteComment('123', '1');
    expect(result.success).toBe(true);
  });
});
