const mongoose = require('mongoose');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const sendValidationError = (res, message, errors = []) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
};

exports.validateProjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendValidationError(res, 'Invalid project id', ['Project id must be a valid ObjectId.']);
    }
    next();
};

exports.validateCreateProject = (req, res, next) => {
    const { name, detail } = req.body;
    const errors = [];

    if (!isNonEmptyString(name) || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long.');
    }

    if (!isNonEmptyString(detail) || detail.trim().length < 3) {
        errors.push('Detail must be at least 3 characters long.');
    }

    if (errors.length > 0) {
        return sendValidationError(res, 'Invalid project payload', errors);
    }

    next();
};

exports.validateUpdateProject = (req, res, next) => {
    const { name, detail } = req.body;
    const errors = [];

    if (name === undefined && detail === undefined) {
        errors.push('At least one field (name or detail) is required for update.');
    }

    if (name !== undefined && (!isNonEmptyString(name) || name.trim().length < 2)) {
        errors.push('Name must be at least 2 characters long.');
    }

    if (detail !== undefined && (!isNonEmptyString(detail) || detail.trim().length < 3)) {
        errors.push('Detail must be at least 3 characters long.');
    }

    if (errors.length > 0) {
        return sendValidationError(res, 'Invalid project update payload', errors);
    }

    next();
};
