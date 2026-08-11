import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
} from '../../src/api/posts.js';

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const mockPosts = [
  { id: '1', title: 'First post', content: 'Hello world', published: false },
  { id: '2', title: 'Second post', content: 'Another post', published: true },
];

const server = setupServer(
  // GET paginated posts
  http.get('http://localhost/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page'));
    const pageSize = Number(url.searchParams.get('pageSize'));
    const paginated = mockPosts.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({
      data: paginated,
      total: mockPosts.length,
      page,
      pageSize,
    });
  }),

  // GET single post
  http.get('http://localhost/posts/1', () => {
    return HttpResponse.json(mockPosts[0]);
  }),

  // POST create post
  http.post('http://localhost/posts', async ({ request }) => {
    const body = (await request.json()) as { title: string; content: string };
    return HttpResponse.json({ id: '3', ...body });
  }),


  // PATCH update post
  http.patch('http://localhost/posts/1', async ({ request }) => {
    const body = (await request.json()) as { title: string; content: string };
    return HttpResponse.json({ id: '1', ...body });
  }),

  // DELETE post
  http.delete('http://localhost/posts/1', () => {
    return HttpResponse.json({ success: true });
  }),

  // PUT publish post
  http.put('http://localhost/posts/1/publish', () => {
    return HttpResponse.json({ id: '1', published: true });
  }),

  // PUT unpublish post
  http.put('http://localhost/posts/1/unpublish', () => {
    return HttpResponse.json({ id: '1', published: false });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('posts API', () => {
  it('fetches paginated posts', async () => {
    const result = await getPosts(1, 1);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(2);
  });

  it('fetches a single post', async () => {
    const result = await getPost('1');
    expect(result?.title).toBe('First post');
  });

  it('creates a new post', async () => {
    const result = await createPost({ title: 'New post', content: 'Content' });
    expect(result.title).toBe('New post');
    expect(result.id).toBe('3');
  });

  it('updates a post', async () => {
    const result = await updatePost('1', { title: 'Updated title', content: 'Updated content' });
    expect(result.title).toBe('Updated title');
  });

  it('deletes a post', async () => {
    const result = await deletePost('1');
    expect(result.success).toBe(true);
  });

  it('publishes a post', async () => {
    const result = await publishPost('1');
    expect(result.published).toBe(true);
  });

  it('unpublishes a post', async () => {
    const result = await unpublishPost('1');
    expect(result.published).toBe(false);
  });
});
