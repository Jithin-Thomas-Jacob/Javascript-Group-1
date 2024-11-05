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
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  console.log("loading", tasks);
  if (tasks) {
    tasks.forEach((task) => {
      // console.log('forEach',task);
      showTasks(task);
    });
  }
}

function addNewTask() {
  console.log("addNewTask");

  if (taskTitle.value !== "" && taskAssignedTo.value !== "") {
    const task = {
      id: Date.now(),
      title: taskTitle.value,
      assignedTo: taskAssignedTo.value,
      dueDate: taskDueDate.value,
      description: taskDescription.value,
      priority: taskPriority.value,
    };
    saveTasks(task);
    showTasks(task);
  }
}

function saveTasks(task) {
  const taskSaved = JSON.parse(localStorage.getItem("tasks") || "[]");
  taskSaved.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskSaved));
  console.log(taskSaved);
  //   tasklist.innerHTML += `<li>${task.title}</li>`;
}
function showTasks(task) {
  if (task) {
    const newCard = createTaskCard(task);
    if (newCard) {
      console.log("new card", tasklistContainer);
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
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const task = tasks.find((task) => task.id === id);
  
  if (task) {
      taskTitle.value = task.title,
      taskAssignedTo.value = task.assignedTo,
      taskDueDate.value = task.dueDate,
      taskDescription.value = task.description,
      taskPriority.value = task.priority;
      
      addTaskBtn.removeEventListener("click", addNewTask);
      addTaskBtn.textContent = "Save Task";
      addTaskBtn.onclick = function () {
          saveEditedTask(id);
        };
    }
}

function saveEditedTask(id){
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if(taskIndex !== -1){
        tasks[taskIndex].title = taskTitle.value;
        tasks[taskIndex].assignedTo = taskAssignedTo.value;
        tasks[taskIndex].dueDate = taskDueDate.value;
        tasks[taskIndex].description = taskDescription.value;
        tasks[taskIndex].priority = taskPriority.value;
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        tasklistContainer.innerHTML = '';
        loadTasks();
        
        addTaskBtn.textContent = 'Add Task';
        addTaskBtn.addEventListener('click', addNewTask);
    }
}

function deleteTask(id){
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.filter(task => task.id !== id);
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    tasklistContainer.innerHTML = '';
    loadTasks();
}