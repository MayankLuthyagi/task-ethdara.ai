const User = require('./auth.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');

const sanitizeUser = (userDoc) => {
    if (!userDoc) {
        return null;
    }

    const safeUser = userDoc.toObject();
    delete safeUser.password;
    return safeUser;
};

exports.addUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        const safeUser = sanitizeUser(user);

        res.status(201).json(safeUser);
    } catch (error) {
        next(error);
    }
}

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Invalid password'
            });
        }

        const token = generateToken(user);
        const safeUser = sanitizeUser(user);
        res.json({
            message: 'Login successful',
            token,
            user: safeUser
        });
    } catch (error) {
        next(error);
    }

}