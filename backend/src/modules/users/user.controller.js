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
