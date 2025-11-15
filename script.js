const input = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

class Task {
    constructor(id, title, isCompleted = false) {
        this.id = id;
        this.title = title;
        this.isCompleted = isCompleted;
    }

    toggleCompletion() {
        this.isCompleted = !this.isCompleted;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(title) {
        const task = new Task(Date.now(), title);
        this.tasks.push(task);
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) task.toggleCompletion();
    }

    renderTasks() {
        taskList.innerHTML = "";

        this.tasks.forEach((task) => {
            taskList.innerHTML += `
      <li class="task-item ${task.isCompleted ? "completed" : ""}">
        <div class="task-left">
          <input 
            type="checkbox" 
            ${task.isCompleted ? "checked" : ""}
            onchange="taskManager.toggleTaskCompletion(${
                task.id
            }); taskManager.saveTasks(); taskManager.renderTasks();"
          />
          <span class="task-text">${task.title}</span>
        </div>

        <button 
          class="delete-btn"
          onclick="taskManager.deleteTask(${
              task.id
          }); taskManager.saveTasks(); taskManager.renderTasks();"
        >
          Delete
        </button>
      </li>
    `;
        });
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
            this.tasks = tasks.map(
                (task) => new Task(task.id, task.title, task.isCompleted)
            );
        }
    }
}

const taskManager = new TaskManager();
taskManager.loadTasks();
taskManager.renderTasks();

function addNewTask() {
    const title = input.value.trim();
    if (!title) alert("Please enter a task title.");
    else {
        taskManager.addTask(title);
        taskManager.renderTasks();
        input.value = "";
    }
    taskManager.saveTasks();
}

addButton.addEventListener("click", () => {
    addNewTask();
});

window.addEventListener("keypress", (event) => {
    if (event.key === "Enter") addNewTask();
});
