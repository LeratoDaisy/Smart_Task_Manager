const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text, date, priority) {
  tasks.push({
    id: Date.now(),
    text,
    date,
    priority,
    completed: false,
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "completed") {
    return tasks.filter((t) => t.completed);
  }

  if (currentFilter === "today") {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter((t) => t.date === today);
  }

  return tasks;
}

function renderTasks() {
  taskList.innerHTML = "";

  getFilteredTasks().forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>
        ${task.text}
        <small>(${task.priority}${task.date ? " • " + task.date : ""})</small>
      </span>
      <input type="checkbox" ${task.completed ? "checked" : ""} />
    `;

    li.querySelector("input").addEventListener("change", () => {
      toggleTask(task.id);
    });

    taskList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value, taskDate.value, taskPriority.value);
  form.reset();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
