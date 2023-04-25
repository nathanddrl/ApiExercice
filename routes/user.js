const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middlewares/auth');


/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user
 *     description: Get a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a user
 *     description: Create a user
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The user to create
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Update a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *       - in: body
 *         name: body
 *         description: The user to update
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

// Route pour récupérer tous les utilisateurs
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Route pour récupérer un utilisateur spécifique
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Route pour créer un nouvel utilisateur
router.post('/', verifyToken, async (req, res) => {
    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).send('Cet utilisateur existe déjà.');

    // Cryptez le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Créez un nouvel utilisateur
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
    });

    // Sauvegardez l'utilisateur dans la base de données
    try {
        const savedUser = await user.save();
        res.status(201).send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
});


// Route pour mettre à jour un utilisateur
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Route pour supprimer un utilisateur
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const removedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).send(removedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
