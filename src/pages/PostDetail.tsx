import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";

import { getPost, publishPost, unpublishPost, updatePost } from "../api/posts";
import {
  getCommentsForPost,
  createComment,
  deleteComment,
  updateComment
} from "../api/comments";

import type { Post } from "../types/post";
import type { Comment } from "../types/comment";
import type { PostFormValues } from "../components/PostForm";
import PostForm from "../components/PostForm";

const PostDetail = () => {
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

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

  const handleStartCommentEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleSaveCommentEdit = async (commentId: string) => {
    try {
      await updateComment(commentId, { content: editCommentText });

      // Refresh comments
      const updated = await getCommentsForPost(id!);
      setComments(updated);

      setEditingCommentId(null);
      setEditCommentText("");
    } catch {
      setError("Failed to update comment.");
    }
  };

  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleStartEditPost = () => {
    setEditingPost(true);
  };

  const handleCancelEditPost = () => {
    setEditingPost(false);
  };

  const handleSaveEditPost = async (values: PostFormValues) => {
    setSavingPost(true);
    setError(null);

    try {
      await updatePost(id!, values);

      // Refresh post data
      const updated = await getPost(id!);
      setPost(updated);

      setEditingPost(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update post.");
    } finally {
      setSavingPost(false);
    }
  };

  const handlePublish = async () => {
    try {
      await publishPost(id!);
      const updated = await getPost(id!);
      setPost(updated);
    } catch {
      setError("Failed to publish post.");
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishPost(id!);
      const updated = await getPost(id!);
      setPost(updated);
    } catch {
      setError("Failed to unpublish post.");
    }
  };

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (!post) return <p className={styles.error}>Post not found.</p>;

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <h1 className={styles.heading}>{post.title}{post.published ? "" : "  (Draft)"}</h1>

      {editingPost ? (
        <PostForm
          initialValues={{
            title: post.title ?? "",
            content: post.content ?? ""
          }}
          loading={savingPost}
          error={error}
          onSubmit={handleSaveEditPost}
          onCancel={handleCancelEditPost }
        />
      ) : (
        <>
          <div className={styles.postActions}>
            <button className={styles.editButton} onClick={handleStartEditPost}>
              Edit
            </button>

            {post.published ? (
              <button className={styles.unpublishButton} onClick={handleUnpublish}>
                Unpublish
              </button>
            ) : (
              <button className={styles.publishButton} onClick={handlePublish}>
                Publish
              </button>
            )}
          </div>

          <div className={styles.content}>
            <p>{post.content}</p>
          </div>
        </>
      )}

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
                {editingCommentId === c.id ? (
            <div className={styles.editContainer}>
              <textarea
                className={styles.textarea}
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
              />

              <div className={styles.commentActions}>
                <button
                  className={styles.submitButton}
                  onClick={() => handleSaveCommentEdit(c.id)}
                >
                  Save
                </button>

                <button
                  className={styles.cancelButton}
                  onClick={handleCancelCommentEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>{c.content}</div>

              <div className={styles.commentActions}>
                {/* Only show Edit if admin is the author */}
                {c.authorId === post.authorId && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleStartCommentEdit(c)}
                  >
                    Edit
                  </button>
                )}

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteComment(c.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}

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
