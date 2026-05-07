const Projects = require('../projects/project.model');
const Tasks = require('../tasks/task.model');
const TaskAssign = require('../taskAssign/taskAssign.model');
const ProjectAssign = require('../projectAssign/projectAssign.model');

const buildTaskStatusBreakdown = (rows) => {
    const base = {
        pending: 0,
        'in-progress': 0,
        completed: 0,
        overdue: 0
    };

    rows.forEach((row) => {
        if (row && row._id && Object.prototype.hasOwnProperty.call(base, row._id)) {
            base[row._id] = row.count;
        }
    });

    return base;
};

exports.getDashboardSummary = async (req, res, next) => {
    try {
        const now = new Date();

        const [
            totalProjects,
            totalTasks,
            totalTaskAssignments,
            totalProjectAssignments,
            groupedStatuses,
            overdueTasks
        ] = await Promise.all([
            Projects.countDocuments(),
            Tasks.countDocuments(),
            TaskAssign.countDocuments(),
            ProjectAssign.countDocuments(),
            Tasks.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Tasks.countDocuments({
                dueDate: { $lt: now },
                status: { $ne: 'completed' }
            })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totals: {
                    projects: totalProjects,
                    tasks: totalTasks,
                    taskAssignments: totalTaskAssignments,
                    projectAssignments: totalProjectAssignments
                },
                taskStatus: buildTaskStatusBreakdown(groupedStatuses),
                overdueTasks
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyDashboardSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        const [myTaskAssignments, myProjectAssignments] = await Promise.all([
            TaskAssign.find({ user_id: userId }).populate('task_id', 'status dueDate projectId'),
            ProjectAssign.find({ user_id: userId })
        ]);

        const myTaskStatus = {
            pending: 0,
            'in-progress': 0,
            completed: 0,
            overdue: 0
        };

        let myOverdueTasks = 0;

        myTaskAssignments.forEach((assignment) => {
            const task = assignment.task_id;
            if (!task) {
                return;
            }

            const taskStatus = task.status;
            if (Object.prototype.hasOwnProperty.call(myTaskStatus, taskStatus)) {
                myTaskStatus[taskStatus] += 1;
            }

            const isOverdue = task.dueDate
                && new Date(task.dueDate) < now
                && task.status !== 'completed';

            if (isOverdue) {
                myOverdueTasks += 1;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                totals: {
                    assignedProjects: myProjectAssignments.length,
                    assignedTasks: myTaskAssignments.length
                },
                taskStatus: myTaskStatus,
                overdueTasks: myOverdueTasks
            }
        });
    } catch (error) {
        next(error);
    }
};
