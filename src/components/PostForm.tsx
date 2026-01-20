import { useState } from "react";
import styles from "./PostForm.module.css";

export type PostFormValues = {
  title: string;
  content: string;
};

type PostFormProps = {
  initialValues?: PostFormValues;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: PostFormValues) => Promise<void>;
  onCancel?: () => void;
};

const PostForm = ({
  initialValues = { title: "", content: "" },
  loading = false,
  error = null,
  onSubmit,
  onCancel
}: PostFormProps) => {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <label className={styles.label}>Title</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className={styles.label}>Content</label>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonRow}>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save Post"}
        </button>

        {onCancel && (
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
