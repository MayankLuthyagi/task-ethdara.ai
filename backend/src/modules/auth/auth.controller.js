const User = require('./auth.model');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(201).json(safeUser);
    } catch (error) {
        next(error);
    }
}