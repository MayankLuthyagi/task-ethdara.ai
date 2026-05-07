const allowedRoles = ['admin', 'member'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const sendValidationError = (res, message, errors = []) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
};

exports.validateSignup = (req, res, next) => {
    const { name, email, password, role } = req.body;
    const errors = [];

    if (!isNonEmptyString(name) || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long.');
    }

    if (!isNonEmptyString(email) || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('A valid email is required.');
    }

    if (!isNonEmptyString(password) || password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    if (role !== undefined && !allowedRoles.includes(role)) {
        errors.push(`Role must be one of: ${allowedRoles.join(', ')}.`);
    }

    if (errors.length > 0) {
        return sendValidationError(res, 'Invalid signup payload', errors);
    }

    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!isNonEmptyString(email) || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('A valid email is required.');
    }

    if (!isNonEmptyString(password)) {
        errors.push('Password is required.');
    }

    if (errors.length > 0) {
        return sendValidationError(res, 'Invalid login payload', errors);
    }

    next();
};
