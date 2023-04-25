const express = require('express');
const router = express.Router();
const Monkey = require('../models/monkey');
const verifyToken = require('../middlewares/auth');

/**
 * @swagger
 * /monkeys:
 *   get:
 *     tags:
 *       - Monkeys
 *     summary: Get all monkeys
 *     description: Get all monkeys
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
 * /monkeys/{id}:
 *   get:
 *     tags:
 *       - Monkeys
 *     summary: Get a monkey
 *     description: Get a monkey
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The monkey id
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
 *       - Monkeys
 *     summary: Create a monkey
 *     description: Create a monkey
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The monkey to create
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - age
 *             - cool
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: number
 *             cool:
 *               type: boolean
 *     responses:
 *       201:
 *         description: Monkey created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   put:
 *     tags:
 *       - Monkeys
 *     summary: Update a monkey
 *     description: Update a monkey
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The monkey id
 *       - in: body
 *         name: body
 *         description: The monkey to update
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: number
 *             cool:
 *               type: boolean
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
 *       - Monkeys
 *     summary: Delete a monkey
 *     description: Delete a monkey
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The monkey id
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

// Route pour récupérer tous les singes
router.get('/', verifyToken, async (req, res) => {
    try {
        const monkeys = await Monkey.find();
        res.json(monkeys);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const monkey = await Monkey.findById(req.params.id);
        res.json(monkey);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', verifyToken, async (req, res) => {

    const monkey = new Monkey({
        name: req.body.name,
        age: req.body.age,
        cool: req.body.cool
    });

    try {
        const savedMonkey = await monkey.save();
        res.status(201).json(savedMonkey);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedMonkey = await Monkey.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    cool: req.body.cool
                }
            }
        );
        res.json(updatedMonkey);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const removedMonkey = await Monkey.remove({ _id: req.params.id });
        res.json(removedMonkey);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

// Path: routes\monkeys.js
