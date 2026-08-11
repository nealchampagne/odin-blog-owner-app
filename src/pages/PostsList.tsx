import { useEffect, useState, useCallback} from "react";
import { Link } from "react-router-dom";
import styles from "./PostsList.module.css";

import { getPosts, deletePost } from "../api/posts.js";
import EmptyState from "../components/EmptyState.jsx";

import type { Post } from "../types/post.js";

// Generate list of posts
const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Load posts function
  const loadPosts = useCallback(async () => {
    setLoading(true);

    // Fetch posts with pagination
    const res = await getPosts(page, pageSize);
    setPosts(res.data);
    setTotalPages(res.totalPages);

    // Extract comment counts
    setCommentCounts(
      Object.fromEntries(
        (res.data as { id: string; _count: { comments: number } }[])
          .map((p) => [p.id, p._count.comments])
      )
    );


    setLoading(false);
  }, [page, pageSize]);

  // Initial load and reload on page change
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

  // Format published date for readability
  const formatPublishedAt = (dateString: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return `${datePart} - ${timePart}`;
  };


  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Posts</h1>

        <Link to="/posts/new" className={styles.createButton}>
          + Create Post
        </Link>
      </div>

      {/* Show loading or empty state if no posts to display yet */}
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
          {/* Format posts list as table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Comments</th>
                  <th>Date Published</th>
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

                    <td>{formatPublishedAt(post.publishedAt ?? null)}</td>

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