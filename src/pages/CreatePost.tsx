import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePost.module.css";
import { createPost } from "../api/posts";
import MarkdownEditor from "../components/MarkdownEditor";

const CreatePost = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { title: string; content: string }) => {
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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create New Post</h1>

      <MarkdownEditor
        initialTitle=""
        initialContent=""
        loading={saving}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/posts")}
      />
    </div>
  );
};

export default CreatePost;