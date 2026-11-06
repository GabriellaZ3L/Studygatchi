import { useState } from "react";
import "./App.css";

type Task = {
  id: number;
  name: string;
  description: string;
  category: string;
  dueDate: string;
  reward: number;
  checked: boolean;
};

type TaskFormValues = Omit<Task, "id" | "checked" | "reward"> & {
  reward: string;
};

const getDefaultDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(12, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
};

const createEmptyForm = (): TaskFormValues => ({
  name: "",
  description: "",
  category: "",
  dueDate: getDefaultDueDate(),
  reward: "0",
});

const initialDueDate = getDefaultDueDate();
const initialTasks: Task[] = [
  {
    id: 1,
    name: "Lock in time",
    description: "",
    category: "Study",
    dueDate: initialDueDate,
    reward: 10,
    checked: false,
  },
  {
    id: 2,
    name: "Read Chapters 2-3",
    description: "",
    category: "Reading",
    dueDate: initialDueDate,
    reward: 10,
    checked: false,
  },
  {
    id: 3,
    name: "Write new Draft",
    description: "",
    category: "Writing",
    dueDate: initialDueDate,
    reward: 10,
    checked: false,
  },
];

export default function ToDoList() {
  const [items, setItems] = useState(initialTasks);
  const [nextId, setNextId] = useState(initialTasks.length + 1);
  const [newTask, setNewTask] = useState<TaskFormValues>(createEmptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<TaskFormValues>(createEmptyForm);

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newTask.name.trim();
    if (!name) return;

    setItems((prev) => [
      ...prev,
      {
        ...newTask,
        id: nextId,
        name,
        reward: Number(newTask.reward),
        checked: false,
      },
    ]);
    setNextId((id) => id + 1);
    setNewTask(createEmptyForm());
  };

  const checkItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const startEditing = (item: Task) => {
    setEditingId(item.id);
    setEditTask({
      name: item.name,
      description: item.description,
      category: item.category,
      dueDate: item.dueDate,
      reward: String(item.reward),
    });
  };

  const saveEditedItem = (event: React.FormEvent) => {
    event.preventDefault();
    const name = editTask.name.trim();
    if (editingId === null || !name) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? { ...item, ...editTask, name, reward: Number(editTask.reward) }
          : item
      )
    );
    setEditingId(null);
  };

  const updateFormField = (
    form: TaskFormValues,
    setForm: (values: TaskFormValues) => void,
    field: keyof TaskFormValues,
    value: string
  ) => {
    setForm({ ...form, [field]: value });
  };

  const renderTaskFields = (
    form: TaskFormValues,
    setForm: (values: TaskFormValues) => void,
    idPrefix: string
  ) => (
    <div className="todolist-task-fields">
      <label className="todolist-field" htmlFor={`${idPrefix}-name`}>
        Task name
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={form.name}
          onChange={(event) =>
            updateFormField(form, setForm, "name", event.target.value)
          }
          required
        />
      </label>
      <label className="todolist-field" htmlFor={`${idPrefix}-description`}>
        Description
        <textarea
          id={`${idPrefix}-description`}
          value={form.description}
          onChange={(event) =>
            updateFormField(form, setForm, "description", event.target.value)
          }
          rows={3}
        />
      </label>
      <label className="todolist-field" htmlFor={`${idPrefix}-category`}>
        Category
        <input
          id={`${idPrefix}-category`}
          type="text"
          value={form.category}
          onChange={(event) =>
            updateFormField(form, setForm, "category", event.target.value)
          }
        />
      </label>
      <label className="todolist-field" htmlFor={`${idPrefix}-due-date`}>
        Due date
        <input
          id={`${idPrefix}-due-date`}
          type="datetime-local"
          value={form.dueDate}
          onChange={(event) =>
            updateFormField(form, setForm, "dueDate", event.target.value)
          }
          required
        />
      </label>
      <label className="todolist-field" htmlFor={`${idPrefix}-reward`}>
        Reward
        <input
          id={`${idPrefix}-reward`}
          type="number"
          min="0"
          max="100"
          step="1"
          value={form.reward}
          onChange={(event) =>
            updateFormField(form, setForm, "reward", event.target.value)
          }
          required
        />
      </label>
    </div>
  );

  return (
    <div>
      <div className="todolist-logo">
        <h1>Goober To Do List</h1>
      </div>

      <form className="todolist-create-form" onSubmit={addItem}>
        <h2>Add task</h2>
        {renderTaskFields(newTask, setNewTask, "new-task")}
        <button className="todolist-addItem" type="submit">
          Add
        </button>
      </form>

      <ul className="todolist-list">
        {items.map((item) => (
          <li key={item.id} className="todolist-item">
            <div className="todolist-task-info">
              <div className="wrapper">
                <input
                  type="checkbox"
                  id={`checkbox-${item.id}`}
                  name={item.name}
                  checked={item.checked}
                  onChange={() => checkItem(item.id)}
                />
                <label htmlFor={`checkbox-${item.id}`}>{item.name}</label>
              </div>
              <div className="todolist-task-details">
                {item.description && <p>{item.description}</p>}
                <p>
                  {item.category || "Uncategorized"} · Due{" "}
                  {new Date(item.dueDate).toLocaleString()} · Reward:{" "}
                  {item.reward}
                </p>
              </div>
            </div>
            <div className="todolist-actions">
              <button
                className="todolist-editbutton"
                type="button"
                onClick={() => startEditing(item)}
              >
                Edit
              </button>
              <button
                className="todolist-trashbutton"
                type="button"
                onClick={() => removeItem(item.id)}
              >
                Del
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingId !== null && (
        <div
          className="todolist-modal-backdrop"
          onKeyDown={(event) => {
            if (event.key === "Escape") setEditingId(null);
          }}
        >
          <section
            className="todolist-edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="todolist-edit-title"
          >
            <h2 id="todolist-edit-title">Edit task</h2>
            <form onSubmit={saveEditedItem}>
              {renderTaskFields(editTask, setEditTask, "edit-task")}
              <div className="todolist-modal-actions">
                <button
                  type="button"
                  className="todolist-cancelbutton"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
                <button className="todolist-addItem" type="submit">
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
