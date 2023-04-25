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
        cool: req.body.cool,
        speed: req.body.speed,
        intelligence: req.body.intelligence,
        strength: req.body.strength,
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
                    cool: req.body.cool,
                    speed: req.body.speed,
                    intelligence: req.body.intelligence,
                    strength: req.body.strength,
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


router.post('/breed', verifyToken, async (req, res) => {
    try {
      const parent1 = await Monkey.findById(req.body.parentId1);
      const parent2 = await Monkey.findById(req.body.parentId2);
  
      if (!parent1 || !parent2) {
        return res.status(400).send('Les parents ne sont pas valides.');
      }
  
      const child = breed(parent1, parent2);
      const savedChild = await child.save();
  
      res.status(201).json(savedChild);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  router.post('/fight', verifyToken, async (req, res) => {
    try {
        const parent1 = await Monkey.findById(req.body.parentId1);
        const parent2 = await Monkey.findById(req.body.parentId2);
    
        if (!parent1 || !parent2) {
          return res.status(400).send('Les parents ne sont pas valides.');
        }
    
        const fight = fight(parent1, parent2);

        res.status(201).json(fight);

      } catch (err) {
        res.status(500).send(err.message);
      }
    });

  

module.exports = router;

// Path: routes\monkeys.js


function breed(parent1, parent2) {
    const randomModifier = () => Math.floor(Math.random() * 21) - 10;

    // reproduction possible si les parents ont un age inférieur à 20 ans
    if (parent1.age >= 20 || parent2.age >= 20) {
        throw new Error('Les parents sont trop vieux pour se reproduire.');
    }
    else if (parent1._id === parent2._id) {
        throw new Error('Les parents sont les mêmes.');
    }
    else if (parent1.cool === false && parent2.cool === false) {
        throw new Error('Les parents ne sont pas cool et ne s\'attirent pas.');
    }

    const child = new Monkey({
      name: generateUniqueName(),
      age: 0,
      cool: parent1.cool && parent2.cool,
      strength: ((parent1.strength + parent2.strength) / 2) + randomModifier(),
      intelligence: ((parent1.intelligence + parent2.intelligence) / 2) + randomModifier(),
      speed: ((parent1.speed + parent2.speed) / 2) + randomModifier(),
      parentId1: parent1._id,
      parentId2: parent2._id,
    });

    // vieillissement des parents
    parent1.age += 1;
    parent2.age += 1;
    parent1.save();
    parent2.save();
  
    return child;
  }


  function fight(monkey1, monkey2)
    {
        const randomModifier = () => Math.floor(Math.random() * 21) - 10;
    
        // combat possible si les singes ont un age supérieur à 10 ans
        if (monkey1.age < 10 || monkey2.age < 10) {
            throw new Error('Les singes sont trop jeunes pour se battre.');
        }
        else if (monkey1._id === monkey2._id) {
            throw new Error('Les singes sont les mêmes.');
        }
    
        // calcul des points de vie des singes
        const monkey1Life = monkey1.strength + monkey1.intelligence + monkey1.speed + randomModifier();
        const monkey2Life = monkey2.strength + monkey2.intelligence + monkey2.speed + randomModifier();
    
        // calcul du vainqueur et suppression du perdant
        if (monkey1Life > monkey2Life) {
            monkey2.remove();
            return monkey1;
        }
        else if (monkey1Life < monkey2Life) {
            monkey1.remove();
            return monkey2;
        }
        else {
            throw new Error('Les singes ont fait match nul.');
        }
    }
  

  function generateUniqueName() {
    const voyelleTab = ['a', 'e', 'i', 'o', 'u', 'y'];
    const consonneTab = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
    let name = '';

    // génération un nombre aléatoire entre 2 et 10
    const length = Math.floor(Math.random() * 9) + 2;

    // génération d'un nom alternant voyelle et consonne
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            name += consonneTab[Math.floor(Math.random() * consonneTab.length)];
        } else {
            name += voyelleTab[Math.floor(Math.random() * voyelleTab.length)];
        }
        }

    return name;
}

  