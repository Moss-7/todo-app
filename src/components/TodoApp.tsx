"use client";

import { useMemo, useState, useCallback } from "react";
import { Todo, FilterType } from "@/types/todo";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import TodoFilter from "./TodoFilter";

export default function TodoApp() {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>("todos", []);
  const [filter, setFilter] = useState<FilterType>("all");

  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text,
        completed: false,
        createdAt: Date.now(),
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  const editTodo = useCallback(
    (id: string, text: string) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
    },
    [setTodos]
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  if (!isLoaded) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-16">
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
        Todo
      </h1>

      <div className="space-y-6">
        <TodoInput onAdd={addTodo} />

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {todos.length > 0 && (
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>
    </div>
  );
}
