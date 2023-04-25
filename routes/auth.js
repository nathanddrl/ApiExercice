const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



/**
* @swagger
* /auth/register:
*   post:
*     tags:
*       - Auth
*     name: Register
*     summary: Register a new user
*     consumes:
*       - application/json
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
*       '201':
*         description: User created
*       '400':
*         description: Bad request
*       '500':
*         description: Internal server error
*/
// Route d'inscription
router.post('/register', async (req, res) => {
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     name: Login
 *     summary: Login a user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The user to login
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
 *       '200':
 *         description: User logged in
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */


// Route de connexion
router.post('/login', async (req, res) => {
    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email ou mot de passe invalide.');

    // Vérifiez le mot de passe
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email ou mot de passe invalide.');

    // Créez un token JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Renvoyez le token
    res.header('auth-token', token).send(token);
});

module.exports = router;
