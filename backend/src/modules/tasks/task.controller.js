const Tasks = require('./task.model');

exports.getTasks = async(req, res, next) => {
    try{
        const allTasks = await Tasks.find();
        return res.status(201).json({success: true, data: allTasks});
    } catch(error){
        next(error);
    }
};

exports.getTaskById = async(req, res, next) => {
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if(!task){
            return res.status(400).json({success:false, message: "Task Not Found"});
        }
        return res.status(201).json({
            success: true,
            message: "Task found",
            data: task
        });
    } catch (error){
        next(error);
    }
}


exports.addTask = async (req, res, next) => {
    try{
        const {name, detail} = req.body;
        const taskExist = Tasks.findOne({name});
        if(taskExist) {
            return res.status(400).json({success:false, message: "This task name already exist"});
        }
        const task = Task.create({
            name,
            detail
        });
        return res.status(201).json({
            success:true, 
            message: "Task added successfully",
            data: task});
    } catch (error) {
        next(error);
    }
}

exports.updateTaskById = async(req, res, next) => {
    try{
        const taskId = req.params.id;
        const task = await Task.findByIdAndupdate(taskId);
        if(!task){
            return res.status(400).json({success: false, message: "Task Not Found"});
        }
        return res.status(201).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    } catch (error){
        next(error);
    }
}

exports.deleteTaskById = async(req, res, next) => {
    try{
        const taskId = req.params.id;
        const task = await Task.findByIdAndDelete(taskId);
        if(!task){
            return res.status(400).json({success: false, message: "Task Not Found"});
        }
        return res.status(201).json({
            success: true,
            message: "Task deleted successfully",
            data: task
        });
    } catch (error){
        next(error);
    }
}