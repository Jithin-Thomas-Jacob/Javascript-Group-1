document.addEventListener("DOMContentLoaded", loadTasks);
const tasklistContainer = document.getElementById("taskList");
const addTaskBtn = document.querySelector("#addTaskBtn");
addTaskBtn.addEventListener("click", addNewTask);

const taskTitle = document.getElementById("taskTitle");
const taskAssignedTo = document.getElementById("taskAssignedTo");
const taskDueDate = document.getElementById("taskDueDate");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");

function loadTasks() {
  fetch('http://localhost:3001/api/tasks')
    .then(response => response.json())
    .then(tasks => {
      tasklistContainer.innerHTML = '';
      tasks.forEach(task => showTasks(task));
    })
    .catch(error => console.log('Error:', error));
}

function addNewTask() {
  if (taskTitle.value !== "" && taskAssignedTo.value !== "") {
    const task = {
      title: taskTitle.value,
      assignedTo: taskAssignedTo.value,
      dueDate: taskDueDate.value,
      description: taskDescription.value,
      priority: taskPriority.value,
    };

    fetch('http://localhost:3001/api/newtask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(newTask => {
      showTasks(newTask);
      resetForm();
    })
    .catch(error => console.log('Error:', error));
  }
}

function showTasks(task) {
  if (task) {
    const newCard = createTaskCard(task);
    if (newCard) {
      tasklistContainer.appendChild(newCard);
    }
  }
}

function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = `task-list-card task-list-${task.priority}`;
  taskCard.innerHTML = `
    <p class="dueDate">Due date: ${task.dueDate}</p>
    <small class="${task.priority}">${task.priority}</small> - <small class="assigned"> ${task.assignedTo}</small>
    <div>
    <h2>${task.title}</h2>   
    <p class="description">${task.description}</p></div>
    <div class="buttons">
    <button class="editTaskBtn" onclick='editTask(${task.id})'>Edit</button>
    <button class="deleteTaskBtn" onclick='deleteTask(${task.id})'>Delete</button>
    </div>
  `;
  return taskCard;
}

function editTask(id) {
  fetch(`http://localhost:3001/api/task/${id}`)
    .then(response => response.json())
    .then(task => {
      taskTitle.value = task.title;
      taskAssignedTo.value = task.assignedTo;
      taskDueDate.value = task.dueDate;
      taskDescription.value = task.description;
      taskPriority.value = task.priority;

      addTaskBtn.removeEventListener("click", addNewTask);
      addTaskBtn.textContent = "Save Task";
      addTaskBtn.onclick = function () {
        saveEditedTask(id);
      };
    })
    .catch(error => console.log('Error:', error));
}

function saveEditedTask(id) {
  const updatedTask = {
    title: taskTitle.value,
    assignedTo: taskAssignedTo.value,
    dueDate: taskDueDate.value,
    description: taskDescription.value,
    priority: taskPriority.value,
  };

  fetch(`http://localhost:3001/api/task/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  })
  .then(response => response.json())
  .then(updatedTask => {
    tasklistContainer.innerHTML = '';
    loadTasks();
    addTaskBtn.textContent = 'Add Task';
    addTaskBtn.addEventListener('click', addNewTask);
  })
  .catch(error => console.log('Error:', error));
}

function deleteTask(id) {
  console.log("🚀 ~ deleteTask ~ id", id);
  fetch(`http://localhost:3001/api/task/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    tasklistContainer.innerHTML = '';
    loadTasks();
  })
  .catch(error => console.log('Error:', error));
}

function resetForm() {
  taskTitle.value = '';
  taskAssignedTo.value = '';
  taskDueDate.value = '';
  taskDescription.value = '';
  taskPriority.value = 'low';
}

function filterTasks() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  fetch('http://localhost:3001/api/tasks')
    .then(response => response.json())
    .then(tasks => {
      const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchInput) ||
        task.assignedTo.toLowerCase().includes(searchInput)
      );
      tasklistContainer.innerHTML = "";
      filteredTasks.forEach(task => showTasks(task));
    })
    .catch(error => console.log('Error:', error));
}
