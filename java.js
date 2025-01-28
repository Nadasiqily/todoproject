// Select DOM elements
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const allButton = document.getElementById("all");
const doneButton = document.getElementById("done");
const todoButton = document.getElementById("todo");
const deleteDoneButton = document.getElementById("delete-done");
const deleteAllButton = document.getElementById("delete-all");

// Load tasks from localStorage
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks;
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Render tasks in the UI
const renderTasks = (filter = "all") => {
    taskList.innerHTML = "";
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(task => {
        if (filter === "done") return task.completed;
        if (filter === "todo") return !task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${index})"/>
            <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.name}</span>
            <div class="actions">
                <button class="edit" onclick="editTask(${index})">✏️</button>
                <button class="delete" onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
};

// Add a new task
const addTodoItem = () => {
    const taskName = taskInput.value.trim();

    if (!taskName) {
        alert("Task cannot be empty.");
        return;
    }
    if (taskName.length < 5) {
        alert("Task must be at least 5 characters long.");
        return;
    }
    if (!isNaN(taskName.charAt(0))) {
        alert("Task cannot start with a number.");
        return;
    }

    const tasks = loadTasks();
    tasks.push({ name: taskName, completed: false });
    saveTasks(tasks);
    taskInput.value = "";
    renderTasks();
};

// Edit a task
const editTask = (index) => {
    const tasks = loadTasks();
    const newName = prompt("Edit task name:", tasks[index].name);

    if (newName && newName.trim().length >= 5 && isNaN(newName.trim().charAt(0))) {
        tasks[index].name = newName.trim();
        saveTasks(tasks);
        renderTasks();
    } else {
        alert("Invalid task name. Ensure it is at least 5 characters and does not start with a number.");
    }
};

// Delete a task
const deleteTask = (index) => {
    const tasks = loadTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
};

// Toggle task completion
const toggleTask = (index) => {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
};

// Delete all tasks
const deleteAllTasks = () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
        saveTasks([]);
        renderTasks();
    }
};

// Delete completed tasks
const deleteDoneTasks = () => {
    const tasks = loadTasks().filter(task => !task.completed);
    saveTasks(tasks);
    renderTasks();
};

// Event listeners
allButton.addEventListener("click", () => renderTasks("all"));
doneButton.addEventListener("click", () => renderTasks("done"));
todoButton.addEventListener("click", () => renderTasks("todo"));
deleteAllButton.addEventListener("click", deleteAllTasks);
deleteDoneButton.addEventListener("click", deleteDoneTasks);

// Initial render
renderTasks();
