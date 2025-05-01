const { model } = require('mongoose');
// const Task = require('../models/task');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

// @desc get all users (admin only)
// @route GET /api/users
// @access Private/admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({role:'member'}).select('-password');

        // add task count to each user
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const pendingTask = await Task.countDocuments({ assignedTo :user._id, status: 'pending' });
            const inProgressTask = await Task.countDocuments({ assignedTo :user._id, status: 'inprogress' });
            const completeTask = await Task.countDocuments({ assignedTo :user._id, status: 'completed' });
            return { ...user._doc, pendingTask, inProgressTask, completeTask };
        }));
        res.json(usersWithTaskCount);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc get user by id (admin only)
// @route GET /api/users/:id
// @access Private/
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc delete user (admin only)
// @route DELETE /api/users/:id
// @access Private/admin

// const deleteUser = async (req, res) => {
//     try {
//         // const user = await User.findById(req.params.id);
//         // if (!user) {
//         //     return res.status(404).json({ message: 'User not found' });
//         // }

//         // // delete all tasks created by this user
//         // await Task.deleteMany({ user: req.params.id });

//         // await user.remove();
//         // res.status(200).json({ message: 'User removed' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

module.exports = {
    getUsers,
    getUserById
};