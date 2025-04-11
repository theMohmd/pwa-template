"use client";
import { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Trash2,
  Check,
  GripVerticalIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  group: string;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [groups, setGroups] = useState<string[]>(["General"]);
  const [selectedGroup, setSelectedGroup] = useState("General");
  const [collapsedGroups, setCollapsedGroups] = useState<{
    [group: string]: boolean;
  }>({});
  const [inputValue, setInputValue] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect click outside of group dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowGroupDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load from localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    const storedGroups = localStorage.getItem("groups");
    const storedCollapsed = localStorage.getItem("collapsedGroups");

    if (storedTodos) setTodos(JSON.parse(storedTodos));
    if (storedGroups) setGroups(JSON.parse(storedGroups));
    if (storedCollapsed) setCollapsedGroups(JSON.parse(storedCollapsed));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("groups", JSON.stringify(groups));
    localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
  }, [todos, groups, collapsedGroups]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      group: selectedGroup,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const addGroup = (name: string) => {
    const newGroup = name.trim();
    if (!newGroup || groups.includes(newGroup)) return;
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroup(newGroup);
  };

  const handleInputSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (trimmed.endsWith("/")) {
      addGroup(trimmed.slice(0, -1));
    } else {
      addTodo(trimmed);
    }

    setInputValue("");
  };

  const toggleCompletion = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleCollapse = (group: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (type === "group") {
      const newGroups = Array.from(groups);
      const [moved] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, moved);
      setGroups(newGroups);
      return;
    }

    const draggedTodoId = parseInt(draggableId);
    const draggedTodo = todos.find((t) => t.id === draggedTodoId);
    if (!draggedTodo) return;

    const filteredTodos = todos.filter((t) => t.id !== draggedTodoId);
    const destinationGroupTodos = filteredTodos.filter(
      (t) => t.group === destination.droppableId,
    );

    destinationGroupTodos.splice(destination.index, 0, {
      ...draggedTodo,
      group: destination.droppableId,
    });

    const updatedTodos = [
      ...filteredTodos.filter((t) => t.group !== destination.droppableId),
      ...destinationGroupTodos,
    ];

    setTodos(updatedTodos);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-neutral-950 px-4 py-6 text-neutral-100">
      <div className="text-center text-2xl font-bold mb-4">Todo</div>

      <div className="flex-1 overflow-y-auto pb-[140px]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="group-droppable" type="group">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {groups.map((group, index) => {
                  const groupTodos = todos
                    .filter((todo) => todo.group === group)
                    .sort((a, b) => a.id - b.id);
                  const isCollapsed = collapsedGroups[group];

                  return (
                    <Draggable draggableId={group} index={index} key={group}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className="mb-6"
                        >
                          <div
                            {...dragProvided.dragHandleProps}
                            onClick={() => toggleCollapse(group)}
                            className="flex justify-between items-center cursor-pointer mb-2"
                          >
                            <h2 className="text-lg font-semibold flex items-center gap-1">
                              {isCollapsed ? (
                                <ChevronRight size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                              {group}
                            </h2>
                            <span className="text-sm text-neutral-400">
                              {groupTodos.length} tasks
                            </span>
                          </div>

                          {!isCollapsed && (
                            <Droppable droppableId={group} type="todo">
                              {(todoProvided) => (
                                <ul
                                  {...todoProvided.droppableProps}
                                  ref={todoProvided.innerRef}
                                  className="space-y-4 min-h-[48px]"
                                >
                                  {groupTodos.map((todo, todoIndex) => (
                                    <Draggable
                                      key={todo.id}
                                      draggableId={todo.id.toString()}
                                      index={todoIndex}
                                    >
                                      {(provided, snapshot) => (
                                        <li
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={`flex items-center justify-between p-4 rounded-xl bg-neutral-800 shadow transition ${
                                            snapshot.isDragging
                                              ? "shadow-lg"
                                              : ""
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
                                              onClick={() =>
                                                toggleCompletion(todo.id)
                                              }
                                              className="text-neutral-400 hover:text-neutral-300"
                                            >
                                              <Check size={20} />
                                            </button>
                                            <button
                                              onClick={() =>
                                                removeTodo(todo.id)
                                              }
                                              className="text-neutral-400 hover:text-neutral-300"
                                            >
                                              <Trash2 size={20} />
                                            </button>
                                          </div>
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                  {groupTodos.length === 0 && (
                                    <li className="text-sm text-neutral-500 italic px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
                                      No tasks in this group.
                                    </li>
                                  )}
                                  {todoProvided.placeholder}
                                </ul>
                              )}
                            </Droppable>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-3 space-y-2 z-20">
        {/* Group Dropdown */}
        <div className="relative mb-2" ref={dropdownRef}>
          <button
            onClick={() => setShowGroupDropdown((prev) => !prev)}
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-left text-neutral-100 flex justify-between items-center"
          >
            <span>{selectedGroup}</span>
            {showGroupDropdown ? (
              <ChevronUp size={18} className="text-neutral-400" />
            ) : (
              <ChevronDown size={18} className="text-neutral-400" />
            )}
          </button>

          {showGroupDropdown && (
            <ul className="absolute bottom-full mb-2 z-30 w-full rounded-lg bg-neutral-800 border border-neutral-700 shadow-lg max-h-60 overflow-y-auto">
              {groups.map((group) => (
                <li
                  key={group}
                  className="group flex justify-between items-center px-4 py-2 hover:bg-neutral-700"
                >
                  <span
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowGroupDropdown(false);
                    }}
                    className="cursor-pointer flex-1"
                  >
                    {group}
                  </span>
                  {group !== "General" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmed = confirm(
                          `Delete group "${group}" and all its tasks?`,
                        );
                        if (!confirmed) return;
                        setGroups((prev) => prev.filter((g) => g !== group));
                        setTodos((prev) =>
                          prev.filter((todo) => todo.group !== group),
                        );
                        if (selectedGroup === group) {
                          const fallback =
                            groups.find((g) => g !== group) || "General";
                          setSelectedGroup(fallback);
                        }
                      }}
                      className="text-neutral-500 group-hover:text-red-400 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInputSubmit();
              }
            }}
            placeholder='New task or "GroupName/" to create group'
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          />
          <button
            onClick={handleInputSubmit}
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
