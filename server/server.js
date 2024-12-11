const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname, "../web")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/index.html"));
});

const tasksFilePath = path.join(__dirname, "data", "tasks.json");

function readTasks() {
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(tasksFilePath, "utf8");
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post("/api/newtask", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    assignedTo: req.body.assignedTo,
    dueDate: req.body.dueDate,
    description: req.body.description,
    priority: req.body.priority,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.get("/api/task/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((task) => task.id === parseInt(req.params.id, 10));

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.put("/api/task/:id", (req, res) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(
    (task) => task.id === parseInt(req.params.id)
  );

  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: req.body.title,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      description: req.body.description,
      priority: req.body.priority,
    };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.delete("/api/task/:id", (req, res) => {
  let tasks = readTasks();
  const filteredTasks = tasks.filter(
    (task) => task.id !== parseInt(req.params.id)
  );

  if (tasks.length !== filteredTasks.length) {
    writeTasks(filteredTasks);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.listen(port, () => {
  console.log(`Sever running on http://localhost:${port}`);
});
