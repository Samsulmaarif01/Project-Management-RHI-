const task = require("../models/Task");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = as
}catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } 
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {};

// @desc    Create a new task(admin only)
// @route   POST /api/tasks
// @access  Private(admin)
const createTask = async (req, res) => {};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {};

// @desc    Delete a task(admin only)
// @route   DELETE /api/tasks/:id
// @access  Private(admin)
const deleteTask = async (req, res) => {};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {};

// @desc    Get dashboard data(admin only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {};


    

