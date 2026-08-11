import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MarkdownEditor from '../../src/components/MarkdownEditor.jsx';

describe('MarkdownEditor', () => {
  const onSubmit = vi.fn(() => Promise.resolve());
  const onCancel = vi.fn();

  it('renders initial title and content', () => {
    render(<MarkdownEditor initialTitle="Hello" initialContent="**bold**" onSubmit={onSubmit} onCancel={onCancel} />);
    expect(screen.getByPlaceholderText('Post title…')).toHaveValue('Hello');
    expect(screen.getByPlaceholderText('Write your post in markdown…')).toHaveValue('**bold**');
    expect(screen.getByText('bold')).toBeInTheDocument(); // preview renders markdown
  });

  it('updates title and content on change', () => {
    render(<MarkdownEditor initialTitle="" initialContent="" onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByPlaceholderText('Post title…'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write your post in markdown…'), { target: { value: '# Heading' } });
    expect(screen.getByPlaceholderText('Post title…')).toHaveValue('New Title');
    expect(screen.getByText('Heading')).toBeInTheDocument(); // preview shows heading
  });

  it('calls onSubmit with current values', async () => {
    render(<MarkdownEditor initialTitle="T" initialContent="C" onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalledWith({ title: 'T', content: 'C' });
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<MarkdownEditor initialTitle="" initialContent="" onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<MarkdownEditor initialTitle="" initialContent="" loading onSubmit={onSubmit} onCancel={onCancel} />);
    expect(screen.getByText('Saving…')).toBeDisabled();
  });

  it('shows error message', () => {
    render(<MarkdownEditor initialTitle="" initialContent="" error="Something went wrong" onSubmit={onSubmit} onCancel={onCancel} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
