const input = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

class Task {
    constructor(id, title, status = "pending") {
        this.id = id;
        this.title = title;
        this.status = status;
    }

    toggleStatus() {
        this.status = this.status === "pending" ? "completed" : "pending";
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = "all";
    }

    addTask(title) {
        const task = new Task(Date.now(), title);
        this.tasks.push(task);
        this.updateBadges();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.updateBadges();
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.toggleStatus();
            this.updateBadges();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderTasks();
    }

    getFilteredTasks() {
        if (this.currentFilter === "pending") {
            return this.tasks.filter((task) => task.status === "pending");
        }
        if (this.currentFilter === "completed") {
            return this.tasks.filter((task) => task.status === "completed");
        }
        return this.tasks;
    }

    renderTasks() {
        taskList.innerHTML = "";

        const filteredTasks = this.getFilteredTasks();
        filteredTasks.forEach((task) => {
            taskList.innerHTML += `
      <li class="task-item ${task.status === "completed" ? "completed" : ""}">
        <div class="task-left">
          <input 
            type="checkbox" 
            ${task.status === "completed" ? "checked" : ""}
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

        this.updateBadges();
    }

    updateBadges() {
        const allCount = this.tasks.length;
        const completedCount = this.tasks.filter(
            (task) => task.status === "completed"
        ).length;
        const pendingCount = this.tasks.filter(
            (task) => task.status === "pending"
        ).length;

        document.getElementById("allBadge").textContent = allCount;
        document.getElementById("completedBadge").textContent = completedCount;
        document.getElementById("pendingBadge").textContent = pendingCount;
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
            this.tasks = tasks.map(
                (task) => new Task(task.id, task.title, task.status)
            );
        }
    }
}

const taskManager = new TaskManager();
taskManager.loadTasks();
taskManager.renderTasks();
taskManager.updateBadges();

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

const filterButtons = document.querySelectorAll(".filterBtn");
filterButtons.forEach((button, index) => {
    const filters = ["all", "completed", "pending"];
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        taskManager.setFilter(filters[index]);
    });
});

filterButtons[0].classList.add("active");
