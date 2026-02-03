export type Post = {
  id: string;
  title: string;
  content?: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  _count: {
    comments: number;
  };
};

export type CreatePostPayload = {
  title: string;
  content?: string;
};

export type UpdatePostPayload = {
  title?: string;
  content?: string;
};