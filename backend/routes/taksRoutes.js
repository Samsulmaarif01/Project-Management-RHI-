const express = require("express");
const {protect, adminOnly} = require("../middleware/authMiddleware");
const { get } = require("mongoose");

const router = express.Router();

// project routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask); //create task (admin only)
router.put("/:id", protect, updateTask); //update task
router.delete("/:id", protect, adminOnly, deleteTask); //delete task (admin only)
router.put("/:id/status", protect, updateTaskStatus); //update task status
router.put("/:id/todo", protect, updateTaskChecklist); //update task checklist

module.exports = router;