const Projects = require('./project.model');
const ProjectAssign = require('../projectAssign/projectAssign.model');

const isAdmin = (user) => user && user.role === 'admin';

const getAssignedProjectIds = async (userId) => {
    const rows = await ProjectAssign.find({ user_id: userId }).select('project_id');
    return rows.map((item) => item.project_id);
};

exports.getProjects = async (req, res, next) => {
    try {
        if (isAdmin(req.user)) {
            const allProjects = await Projects.find().populate('createdBy', 'name email');
            return res.status(200).json({ success: true, data: allProjects });
        }

        const projectIds = await getAssignedProjectIds(req.user.id);
        const memberProjects = await Projects.find({ _id: { $in: projectIds } }).populate('createdBy', 'name email');
        return res.status(200).json({ success: true, data: memberProjects });
    } catch (error) {
        next(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await Projects.findById(projectId).populate('createdBy', 'name email');
        if (!project) {
            return res.status(400).json({ success: false, message: "Project Not Found" });
        }

        if (!isAdmin(req.user)) {
            const memberAccess = await ProjectAssign.findOne({
                user_id: req.user.id,
                project_id: projectId
            });

            if (!memberAccess) {
                return res.status(403).json({ success: false, message: 'Access Denied' });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Project Found",
            data: project
        });
    } catch (error) {
        next(error);
    }
}

exports.addProject = async (req, res, next) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ success: false, message: 'Access Denied' });
        }

        const { name, detail } = req.body;
        if (!name || !detail) {
            return res.status(400).json({ success: false, message: "Name and detail are required" });
        }
        const projectExist = await Projects.findOne({ name });
        if (projectExist) {
            return res.status(400).json({ success: false, message: "This project name already exist" });
        }
        const project = await Projects.create({
            name,
            detail,
            createdBy: req.user.id
        });
        return res.status(201).json({
            success: true,
            message: "Project added successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
}

exports.updateProjectById = async (req, res, next) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ success: false, message: 'Access Denied' });
        }

        const projectId = req.params.id;
        const updatedProject = await Projects.findByIdAndUpdate(
            projectId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedProject) {
            return res.status(400).json({ success: false, message: "Project Not Found" });
        }
        return res.status(201).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteProjectById = async (req, res, next) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ success: false, message: 'Access Denied' });
        }

        const projectId = req.params.id;
        const project = await Projects.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(400).json({ success: false, message: "Project Not Found" });
        }
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
}