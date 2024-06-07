const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('./models/employee');
const Project = require('./models/project');
const ProjectAssignment = require('./models/projectAssignment');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API Endpoints

// Employee Collection
app.post('/api/employees', async (req, res) => {
  const { employee_id, full_name, email } = req.body;
  try {
    const newEmployee = new Employee({ employee_id, full_name, email });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Project Collection
app.post('/api/projects', async (req, res) => {
  const { project_code, project_name, project_description } = req.body;
  try {
    const newProject = new Project({ project_code, project_name, project_description });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all project assignments with employee and project details
app.get('/api/project_assignments', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employee_id',
          foreignField: 'employee_id',
          as: 'employee'
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project_code',
          foreignField: 'project_code',
          as: 'project'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $unwind: '$project'
      },
      {
        $project: {
          _id: 1,
          employee_id: 1,
          'employee.full_name': 1,
          'project.project_name': 1,
          start_date: 1
        }
      }
    ]);
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Project Assignment Collection
app.post('/api/project_assignments', async (req, res) => {
  const { employee_id, project_code, start_date } = req.body;
  try {
    const newProjectAssignment = new ProjectAssignment({ employee_id, project_code, start_date });
    await newProjectAssignment.save();
    res.status(201).json(newProjectAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
