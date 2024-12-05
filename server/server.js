const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

function readTasks() {
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(tasksFilePath, 'utf8');
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
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

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

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
    res.status(404).json({ message: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));

  if (tasks.length !== tasks.length) {
    writeTasks(tasks);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
