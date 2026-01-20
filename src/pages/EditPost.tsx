import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditPost.module.css";
import PostForm from "../components/PostForm";
import type { PostFormValues } from "../components/PostForm";
import { getPost, updatePost } from "../api/posts";
import type { Post } from "../types/post";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPost(id!);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (values: PostFormValues) => {
    setSaving(true);
    setError(null);

    try {
      await updatePost(id!, values);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError("Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/posts");
  };

  if (loading) {
    return <p className={styles.loading}>Loading…</p>;
  }

  if (!post) {
    return <p className={styles.error}>Post not found.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Post</h1>

      <PostForm
        initialValues={{
          title: post.title ?? "",
          content: post.content ?? ""
        }}
        loading={saving}
        error={error}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditPost;
