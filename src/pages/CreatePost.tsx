import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePost.module.css";
import PostForm from "../components/PostForm";
import type { PostFormValues } from "../components/PostForm";
import { createPost } from "../api/posts";

const CreatePost = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: PostFormValues) => {
    setSaving(true);
    setError(null);

    try {
      await createPost(values);
      navigate("/posts");
    } catch {
      setError("Failed to create post.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/posts");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create New Post</h1>

      <PostForm
        initialValues={{ title: "", content: "" }}
        loading={saving}
        error={error}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreatePost;
