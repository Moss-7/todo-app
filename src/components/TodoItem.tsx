"use client";

import { useState, useRef, useEffect } from "react";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all hover:shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-blue-500 accent-blue-500"
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          onBlur={handleSave}
          className="min-w-0 flex-1 rounded border border-blue-300 bg-transparent px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 dark:border-blue-600 dark:focus:ring-blue-800"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`min-w-0 flex-1 cursor-pointer truncate transition-colors ${
            todo.completed
              ? "text-gray-400 line-through dark:text-gray-500"
              : "text-gray-800 dark:text-gray-200"
          }`}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      {!isEditing && (
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-400"
            aria-label="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            aria-label="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022 1.005 11.07A2.611 2.611 0 0 0 7.622 19.5h4.756a2.611 2.611 0 0 0 2.603-2.469l1.005-11.07.149.022a.75.75 0 1 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 1 .7.8l-.5 5.5a.75.75 0 0 1-1.495-.137l.5-5.5a.75.75 0 0 1 .795-.662Zm2.84 0a.75.75 0 0 1 .795.662l.5 5.5a.75.75 0 1 1-1.495.136l-.5-5.5a.75.75 0 0 1 .7-.798Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
