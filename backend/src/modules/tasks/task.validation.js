const mongoose = require('mongoose');

const allowedTaskStatuses = ['pending', 'in-progress', 'completed', 'overdue'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const sendValidationError = (res, message, errors = []) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
};

const isValidDate = (value) => {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
};

exports.validateTaskId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendValidationError(res, 'Invalid task id', ['Task id must be a valid ObjectId.']);
    }
    next();
};

exports.validateCreateTask = (req, res, next) => {
    const { name, detail, projectId, dueDate, assignedTo } = req.body;
    const errors = [];

    if (!isNonEmptyString(name) || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long.');
    }

    if (!isNonEmptyString(detail) || detail.trim().length < 3) {
        errors.push('Detail must be at least 3 characters long.');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        errors.push('Project id must be a valid ObjectId.');
    }

    if (dueDate !== undefined && !isValidDate(dueDate)) {
        errors.push('Due date must be a valid date value.');
    }

    if (assignedTo !== undefined && !mongoose.Types.ObjectId.isValid(assignedTo)) {
        errors.push('Assigned user id must be a valid ObjectId.');
    }

    if (errors.length > 0) {
        return sendValidationError(res, 'Invalid task payload', errors);
    }

    next();
};

exports.validateUpdateTask = (req, res, next) => {
    const { name, detail, projectId, dueDate, status, assignedTo } = req.body;
    const errors = [];

    if (
        name === undefined
        && detail === undefined
        && projectId === undefined
        && dueDate === undefined
        && status === undefined
        && assignedTo === undefined
    ) {
        errors.push('At least one updatable field is required.');
    }

    if (name !== undefined && (!isNonEmptyString(name) || name.trim().length < 2)) {
        errors.push('Name must be at least 2 characters long.');
    }

    if (detail !== undefined && (!isNonEmptyString(detail) || detail.trim().length < 3)) {
        errors.push('Detail must be at least 3 characters long.');
    }

    if (projectId !== undefined && !mongoose.Types.ObjectId.isValid(projectId)) {
        errors.push('Project id must be a valid ObjectId.');
    }

    if (dueDate !== undefined && !isValidDate(dueDate)) {
        errors.push('Due date must be a valid date value.');
    }

    if (status !== undefined && !allowedTaskStatuses.includes(status)) {
        errors.push(`Status must be one of: ${allowedTaskStatuses.join(', ')}.`);
    }

    if (assignedTo !== undefined && !mongoose.Types.ObjectId.isValid(assignedTo)) {
        errors.push('Assigned user id must be a valid ObjectId.');
    }

    if (errors.length > 0) {
        return sendValidationError(res, 'Invalid task update payload', errors);
    }

    next();
};
