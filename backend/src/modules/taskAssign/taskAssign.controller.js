const TaskAssign = require('./taskAssign.model');
const User = require('../auth/auth.model');
const Tasks = require('../tasks/task.model');

exports.getAllAssignedTasks = async (req, res, next) => {
    try {
        const allAssignedTasks = await TaskAssign.find()
            .populate('user_id', 'name email')
            .populate('task_id');
        return res.status(200).json({ success: true, data: allAssignedTasks });
    } catch (error) {
        next(error);
    }
};

exports.getAssignedTasksByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const assignedTasks = await TaskAssign.find({ user_id: userId })
            .populate('user_id', 'name email')
            .populate('task_id');
        return res.status(200).json({ success: true, data: assignedTasks });
    } catch (error) {
        next(error);
    }
};

exports.assignTask = async (req, res, next) => {
    try {
        const { user_id, task_id, deadline } = req.body;

        // Validate user exists and is a member (not admin)
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== 'member') {
            return res.status(400).json({
                success: false,
                message: "Tasks can only be assigned to members, not admins"
            });
        }

        const existingAssignment = await TaskAssign.findOne({
            user_id: user_id,
            task_id: task_id
        });

        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: "This task is already assigned to the user"
            });
        }

        const taskAssign = await TaskAssign.create({
            user_id,
            task_id,
            deadline
        });

        // Update the Task's assignedTo field
        await Tasks.findByIdAndUpdate(
            task_id,
            { assignedTo: user_id },
            { new: true }
        );

        const populatedAssign = await taskAssign.populate([
            { path: 'user_id', select: 'name email' },
            { path: 'task_id' }
        ]);

        return res.status(201).json({
            success: true,
            message: "Task assigned successfully",
            data: populatedAssign
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTaskAssignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedTaskAssign = await TaskAssign.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate([
            { path: 'user_id', select: 'name email' },
            { path: 'task_id' }
        ]);

        if (!updatedTaskAssign) {
            return res.status(404).json({
                success: false,
                message: "Task assignment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task assignment updated successfully",
            data: updatedTaskAssign
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteTaskAssignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const taskAssign = await TaskAssign.findByIdAndDelete(id);

        if (!taskAssign) {
            return res.status(404).json({
                success: false,
                message: "Task assignment not found"
            });
        }

        // Check if there are any remaining assignments for this task
        const remainingAssignments = await TaskAssign.findOne({ task_id: taskAssign.task_id });

        // If no more assignments, clear the assignedTo field
        if (!remainingAssignments) {
            await Tasks.findByIdAndUpdate(
                taskAssign.task_id,
                { assignedTo: null },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Task assignment deleted successfully",
            data: taskAssign
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const myTasks = await TaskAssign.find({ user_id: userId })
            .populate('user_id', 'name email')
            .populate('task_id');
        return res.status(200).json({
            success: true,
            data: myTasks
        });
    } catch (error) {
        next(error);
    }
};

exports.updateMyTaskStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'pending' or 'completed'"
            });
        }

        const taskAssign = await TaskAssign.findOne({
            _id: id,
            user_id: userId
        });

        if (!taskAssign) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this task"
            });
        }

        const updatedTaskAssign = await TaskAssign.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate([
            { path: 'user_id', select: 'name email' },
            { path: 'task_id' }
        ]);

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: updatedTaskAssign
        });
    } catch (error) {
        next(error);
    }
};
