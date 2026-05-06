const Projects = require('./project.model');

exports.getProjects = async(req, res, next) => {
    try{
        const allProjects = await Projects.find();
        return res.status(201).json({success: true, data: allProjects});
    } catch(error){
        next(error);
    }
};

exports.getProjectById = async(req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(400).json({success: false, message: "Project Not Found"});
        }
        return res.status(201).json({
            success: true,
            message: "Project Found",
            data: project
        });
    } catch (error){
        next(error);
    }
}

exports.addProject = async (req, res, next) => {
    try{
        const {name, detail} = req.body;
        const projectExist = Projects.findOne({name});
        if(projectExist) {
            return res.status(400).json({success:false, message: "This project name already exist"});
        }
        const project = Project.create({
            name,
            detail
        });
        return res.status(201).json({
            success:true, 
            message: "Project added successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
}

exports.updateProjectById = async(req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findByIdAndupdate(projectId);
        if(!project){
            return res.status(400).json({success: false, message: "Project Not Found"});
        }
        return res.status(201).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (error){
        next(error);
    }
}

exports.deleteProjectById = async(req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findByIdAndDelete(projectId);
        if(!project){
            return res.status(400).json({success: false, message: "Project Not Found"});
        }
        return res.status(201).json({
            success: true,
            message: "Project deleted successfully",
            data: project
        });
    } catch (error){
        next(error);
    }
}