"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever the todos change
  useEffect(() => {
    if (todos.length) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodoItem]);
    setNewTodo("");
  };

  // Toggle completion status of a todo
  const toggleCompletion = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Remove a todo
  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="max-w-lg mx-auto p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-neutral-100">
          To-Do List
        </h1>

        <div className="flex mb-6">
          <input
            type="text"
            className="flex-1 p-3 border border-neutral-900 rounded-l-lg text-neutral-100 bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-neutral-700 text-neutral-100 rounded-r-lg hover:bg-neutral-600 focus:ring-2 focus:ring-neutral-500 focus:outline-none"
          >
            Add
          </button>
        </div>

        <ul className="max-h-[80vh] overflow-auto">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex bg-neutral-900 justify-between items-center p-4 mb-4 rounded-lg ${
                todo.completed && "[&_span]:line-through"
              }`}
            >
              <span
                className="cursor-pointer text-lg text-neutral-100"
                onClick={() => toggleCompletion(todo.id)}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="ml-4 text-neutral-400 hover:text-neutral-300 focus:outline-none"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoPage;
