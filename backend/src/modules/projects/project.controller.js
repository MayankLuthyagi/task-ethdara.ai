const Projects = require('./project.model');

exports.getProjects = async(req, res, next) => {
    try{
        const allProjects = await Projects.find();
        return res.status(201).json({success: true, data: allProjects});
    } catch(error){
        next(error);
    }
};