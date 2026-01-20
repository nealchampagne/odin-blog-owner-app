import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";

import { getPost } from "../api/posts";
import {
  getCommentsForPost,
  createComment,
  deleteComment
} from "../api/comments";

import type { Post } from "../types/post";
import type { Comment } from "../types/comment";

const PostDetail = () => {
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [postData, commentData] = await Promise.all([
          getPost(id!),
          getCommentsForPost(id!)
        ]);

        setPost(postData);
        setComments(commentData);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment(id!, { content: commentText });
      setCommentText("");
      
      // Refresh comments list
      const updatedComments = await getCommentsForPost(id!);
      setComments(updatedComments);
    } catch {
      setError("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);
      
      // Refresh comments list
      const updatedComments = await getCommentsForPost(id!);
      setComments(updatedComments);
    } catch {
      setError("Failed to delete comment.");
    }
  };

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (!post) return <p className={styles.error}>Post not found.</p>;

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <h1 className={styles.heading}>{post.title}</h1>

      <div className={styles.content}>
        <p>{post.content}</p>
      </div>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsHeading}>Comments</h2>

        {comments.length === 0 ? (
          <p className={styles.empty}>No comments yet.</p>
        ) : (
          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div>{c.content}</div>

                <div className={styles.commentActions}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.addCommentForm}>
          <textarea
            className={styles.textarea}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment…"
          />

          <button className={styles.submitButton} onClick={handleAddComment}>
            Add Comment
          </button>
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
