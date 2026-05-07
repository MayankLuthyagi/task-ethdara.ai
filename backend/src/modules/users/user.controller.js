const User = require('../auth/auth.model');

const withoutPassword = (userDoc) => {
    const safeUser = userDoc.toObject();
    delete safeUser.password;
    return safeUser;
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: withoutPassword(user)
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            data: withoutPassword(user)
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: withoutPassword(user)
        });
    } catch (error) {
        next(error);
    }
};
