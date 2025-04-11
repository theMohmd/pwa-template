"use client";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, Trash2, Check, GripVerticalIcon } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

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

  const toggleCompletion = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newTodos = Array.from(todos);
    const [movedItem] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, movedItem);

    setTodos(newTodos);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 px-4 py-6 text-neutral-100">
      <div className="text-center text-2xl font-bold mb-4">Todo</div>

      <div className="flex-1 overflow-y-auto pb-28">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                className="space-y-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between p-4 rounded-xl bg-neutral-800 shadow transition ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab text-neutral-400 hover:text-neutral-300 pr-3"
                          title="Drag to reorder"
                        >
                          <GripVerticalIcon size={18} />
                        </div>

                        <span
                          className={`flex-1 text-base ${
                            todo.completed
                              ? "line-through text-neutral-500"
                              : "text-neutral-100"
                          }`}
                        >
                          {todo.text}
                        </span>

                        <div className="flex items-center gap-3 ml-4">
                          <button
                            onClick={() => toggleCompletion(todo.id)}
                            className="text-neutral-400 hover:text-neutral-300"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => removeTodo(todo.id)}
                            className="text-neutral-400 hover:text-neutral-300"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTodo();
              }
            }}
            placeholder="New task..."
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          />
          <button
            onClick={addTodo}
            className="p-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
