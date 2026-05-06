const Assign = require('./assign.model');

exports.getAllAssignTask = async (req, res, next) => {
    try {
        const allAssignTask = await Assign.find({ work_type: "task" }).populate('user_id', 'name email').populate('work_id');
        return res.status(200).json({ success: true, data: allAssignTask });
    } catch (error) {
        next(error);
    }
};

exports.getAllAssignProject = async (req, res, next) => {
    try {
        const allAssignProject = await Assign.find({ work_type: "project" }).populate('user_id', 'name email').populate('work_id');
        return res.status(200).json({ success: true, data: allAssignProject });
    } catch (error) {
        next(error);
    }
};

exports.assignProject = async (req, res, next) => {
    try {
        const { user_id, work_id } = req.body;
        const projectAssigned = Assign.findOne({ user_id: user_id, work_id: work_id, work_type: "project" });
        if (projectAssigned) {
            return res.status(400).json({ success: false, message: "This Project already assigned" });
        }
        const assign = Assign.create({
            user_id,
            work_id,
            work_type: "project"
        });
        return res.status(201).json({
            success: true,
            message: "Project Assigned successfully",
            data: assign
        });
    } catch (error) {
        next(error);
    }
}

exports.assignTask = async (req, res, next) => {
    try {
        const { user_id, work_id } = req.body;
        const taskAssigned = Assign.findOne({ user_id: user_id, work_id: work_id, work_type: "task" });
        if (taskAssigned) {
            return res.status(400).json({ success: false, message: "This Task already assigned" });
        }
        const assign = Assign.create({
            user_id,
            work_id,
            work_type: "task"
        });
        return res.status(201).json({
            success: true,
            message: "Task Assigned successfully",
            data: assign
        });
    } catch (error) {
        next(error);
    }
}
exports.updateAssignById = async (req, res, next) => {
    try {
        const assignId = req.params.id;
        const updatedAssign = await Assign.findByIdAndUpdate(
            assignId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedAssign) {
            return res.status(401).json({ success: false, message: "Not Found" });
        }
        return res.status(201).json({
            success: true,
            message: "Updated Successfully",
            data: updatedAssign
        })

    } catch (error) {
        next(error);
    }
}

exports.deleteAssignById = async (req, res, next) => {
    try {
        const assignId = req.params.id;
        const assign = await Assign.findByIdAndDelete(assignId);
        if (!assign) {
            return res.status(400).json({ success: false, message: "Not Found" });
        }
        return res.status(200).json({
            success: true,
            message: "Deleted successfully",
            data: assign
        });
    } catch (error) {
        next(error);
    }
}