import { useEffect, useState, useCallback} from "react";
import { Link } from "react-router-dom";
import styles from "./PostsList.module.css";

import { getPosts, deletePost } from "../api/posts";
import { getAllCommentsForPost } from "../api/comments";
import EmptyState from "../components/EmptyState";

import type { Post } from "../types/post";

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = useCallback(async () => {
    setLoading(true);

    const res = await getPosts(page, pageSize);
    setPosts(res.data);
    setTotalPages(res.totalPages);

    const counts: Record<string, number> = {};
    await Promise.all(
      res.data.map(async (p) => {
        const comments = await getAllCommentsForPost(p.id);
        counts[p.id] = comments.length;
      })
    );

    setCommentCounts(counts);
    setLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    const run = async () => {
      await loadPosts();
    };
    run(); 
  }, [loadPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    loadPosts();
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Posts</h1>

        <Link to="/posts/new" className={styles.createButton}>
          + Create Post
        </Link>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet."
          message="Create your first post to get started."
          actionLabel="Create your first post"
          actionTo="/posts/new"
        />
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Comments</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className={styles.row}>
                    <td>
                      {post.title}
                      <span
                        className={
                          post.published
                            ? styles.badgePublished
                            : styles.badgeDraft
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td>{commentCounts[post.id] ?? 0}</td>

                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/posts/${post.id}`}
                          className={`${styles.button} ${styles.viewButton}`}
                        >
                          View
                        </Link>

                        <button
                          className={`${styles.button} ${styles.deleteButton}`}
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={styles.pageButton}
            >
              Previous
            </button>

            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        )}

        </>
      )}
    </div>
  );
};

export default PostsList;