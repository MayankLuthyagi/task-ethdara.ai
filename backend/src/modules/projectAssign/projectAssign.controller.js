const ProjectAssign = require('./projectAssign.model');
const User = require('../auth/auth.model');

exports.getAllAssignedProjects = async (req, res, next) => {
    try {
        const allAssignedProjects = await ProjectAssign.find()
            .populate('user_id', 'name email')
            .populate('project_id');
        return res.status(200).json({ success: true, data: allAssignedProjects });
    } catch (error) {
        next(error);
    }
};

// Get all team members (role='member') with their project assignments
exports.getTeamMembers = async (req, res, next) => {
    try {
        // Get all members from users table
        const teamMembers = await User.find({ role: 'member' });

        // For each member, get their project assignments
        const membersWithAssignments = await Promise.all(
            teamMembers.map(async (member) => {
                const assignments = await ProjectAssign.find({ user_id: member._id })
                    .populate('project_id', 'name description');
                return {
                    _id: member._id,
                    name: member.name,
                    email: member.email,
                    role: member.role,
                    assignments: assignments
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: membersWithAssignments
        });
    } catch (error) {
        next(error);
    }
};

exports.getAssignedProjectsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const assignedProjects = await ProjectAssign.find({ user_id: userId })
            .populate('user_id', 'name email')
            .populate('project_id');
        return res.status(200).json({ success: true, data: assignedProjects });
    } catch (error) {
        next(error);
    }
};

exports.getProjectMembers = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const projectMembers = await ProjectAssign.find({ project_id: projectId })
            .populate('user_id', 'name email')
            .populate('project_id');
        return res.status(200).json({ success: true, data: projectMembers });
    } catch (error) {
        next(error);
    }
};

exports.assignProject = async (req, res, next) => {
    try {
        const { user_id, project_id, deadline } = req.body;

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
                message: "Projects can only be assigned to members, not admins"
            });
        }

        const existingAssignment = await ProjectAssign.findOne({
            user_id: user_id,
            project_id: project_id
        });

        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: "This project is already assigned to the user"
            });
        }

        const projectAssign = await ProjectAssign.create({
            user_id,
            project_id,
            deadline,
            role: 'member'
        });

        const populatedAssign = await projectAssign.populate([
            { path: 'user_id', select: 'name email' },
            { path: 'project_id' }
        ]);

        return res.status(201).json({
            success: true,
            message: "Project assigned successfully",
            data: populatedAssign
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProjectAssignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProjectAssign = await ProjectAssign.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate([
            { path: 'user_id', select: 'name email' },
            { path: 'project_id' }
        ]);

        if (!updatedProjectAssign) {
            return res.status(404).json({
                success: false,
                message: "Project assignment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project assignment updated successfully",
            data: updatedProjectAssign
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProjectAssignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const projectAssign = await ProjectAssign.findByIdAndDelete(id);

        if (!projectAssign) {
            return res.status(404).json({
                success: false,
                message: "Project assignment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project assignment deleted successfully",
            data: projectAssign
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyProject = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const myProjects = await ProjectAssign.find({ user_id: userId })
            .populate('user_id', 'name email')
            .populate('project_id');
        return res.status(200).json({
            success: true,
            data: myProjects
        });
    } catch (error) {
        next(error);
    }
};

exports.updateMyProject = async (req, res, next) => {
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

        const projectAssign = await ProjectAssign.findOne({
            _id: id,
            user_id: userId
        });

        if (!projectAssign) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this project"
            });
        }

        const updatedProjectAssign = await ProjectAssign.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate([
            { path: 'user_id', select: 'name email' },
            { path: 'project_id' }
        ]);

        return res.status(200).json({
            success: true,
            message: "Project status updated successfully",
            data: updatedProjectAssign
        });
    } catch (error) {
        next(error);
    }
};
