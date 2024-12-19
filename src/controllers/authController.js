require('dotenv').config();
const prisma = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Validate environment variables
if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables');
}

// Utility function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register --> POST /auth/register
const registerController = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Generate JWT token
        const token = generateToken(user);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error!', details: err.message });
    }
};

// Login --> POST /auth/login
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error!', details: err.message });
    }
};

// User Profile Routes

// View profile --> GET /users/:id
const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: 'User Not Found!!' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error!', details: err.message });
    }
};

// Edit Profile --> PATCH /users/:id
const editUserProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email },
        });
        res.json({ message: 'User Profile Updated Successfully', user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not Found!' });
        }
        res.status(500).json({ error: 'Internal Server Error!', details: err.message });
    }
};

// Delete account --> DELETE /users/:id
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User Account Deleted Successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User Not Found!' });
        }
        res.status(500).json({ error: 'Internal Server Error!', details: err.code });
    }
};

module.exports = {
    registerController,
    loginController,
    getUserProfile,
    editUserProfile,
    deleteUser,
};