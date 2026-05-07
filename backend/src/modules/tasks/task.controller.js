const Tasks = require('./task.model');

exports.getTasks = async (req, res, next) => {
    try {
        const allTasks = await Tasks.find().populate('assignedTo', 'name email').populate('projectId', 'name');
        return res.status(200).json({ success: true, data: allTasks });
    } catch (error) {
        next(error);
    }
};

exports.getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Tasks.findById(taskId).populate('assignedTo', 'name email').populate('projectId', 'name');
        if (!task) {
            return res.status(400).json({ success: false, message: "Task Not Found" });
        }
        return res.status(200).json({
            success: true,
            message: "Task found",
            data: task
        });
    } catch (error) {
        next(error);
    }
}


exports.addTask = async (req, res, next) => {
    try {
        const { name, detail, projectId, dueDate } = req.body;
        if (!name || !detail || !projectId) {
            return res.status(400).json({ success: false, message: "Name, detail, and projectId are required" });
        }
        const taskExist = await Tasks.findOne({ name, projectId });
        if (taskExist) {
            return res.status(400).json({ success: false, message: "This task name already exist in this project" });
        }
        const task = await Tasks.create({
            name,
            detail,
            projectId,
            dueDate
        });
        return res.status(201).json({
            success: true,
            message: "Task added successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
}

exports.updateTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await Tasks.findByIdAndUpdate(
            taskId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedTask) {
            return res.status(400).json({ success: false, message: "Task Not Found" });
        }
        return res.status(201).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Tasks.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(400).json({ success: false, message: "Task Not Found" });
        }
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
}