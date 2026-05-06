const Projects = require('./project.model');

exports.getProjects = async (req, res, next) => {
    try {
        const allProjects = await Projects.find().populate('createdBy', 'name email');
        return res.status(200).json({ success: true, data: allProjects });
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
        const projectId = req.params.id;
        const updatedProject = await Project.findByIdAndUpdate(
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
        const projectId = req.params.id;
        const { name, detail } = req.body;
        const project = await Projects.findByIdAndUpdate(projectId, { name, detail }, { new: true });
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