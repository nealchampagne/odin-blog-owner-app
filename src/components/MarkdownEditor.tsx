import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./MarkdownEditor.module.css";

type MarkdownEditorProps = {
  initialTitle: string;
  initialContent: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: { title: string; content: string }) => Promise<void>;
  onCancel: () => void;
};

const MarkdownEditor = ({
  initialTitle,
  initialContent,
  loading = false,
  error = null,
  onSubmit,
  onCancel
}: MarkdownEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headerRow}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="Post title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className={styles.buttonRow}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? "Saving…" : "Save"}
          </button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.editorGrid}>
        {/* Left Pane — Markdown Input */}
        <div className={styles.editorPane}>
          <label className={styles.label}>Markdown</label>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post in markdown…"
          />
        </div>

        {/* Right Pane — Live Preview */}
        <div className={styles.previewPane}>
          <label className={styles.label}>Preview</label>
          <div className={`${styles.previewContent} ${styles.markdown}`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MarkdownEditor;
