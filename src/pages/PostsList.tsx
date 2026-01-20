import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PostsList.module.css";

import { getPosts, deletePost } from "../api/posts";
import { getCommentsForPost } from "../api/comments";

import type { Post } from "../types/post";

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);

    const postData = await getPosts();
    setPosts(postData);

    // fetch comment counts in parallel
    const counts: Record<string, number> = {};
    await Promise.all(
      postData.map(async (p) => {
        const comments = await getCommentsForPost(p.id);
        counts[p.id] = comments.length;
      })
    );

    setCommentCounts(counts);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    loadPosts();
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadPosts();
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Posts</h1>

      {loading ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <p className={styles.empty}>No posts yet.</p>
      ) : (
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
                  <td>{post.title}</td>
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

                      <Link
                        to={`/posts/${post.id}/edit`}
                        className={`${styles.button} ${styles.editButton}`}
                      >
                        Edit
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
      )}
    </div>
  );
};

export default PostsList;