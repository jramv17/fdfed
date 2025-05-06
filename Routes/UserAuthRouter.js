const express = require('express');
const { login } = require("../middlewares/PassportLoginMiddleware");
const UserAuth = require("../Controllers/UserAuth");
require("../config/passport_config");

// class UserAuthRouter extends UserAuth {
//     constructor() {
//         super();
//         this.route = express.Router();

//         this.route.post('/register', this.register.bind(this));

//         this.route.post('/login', login, (req, res) => {
//             res.status(200).send({ username: req.userDetails.username, email: req.userDetails.email, uuid: req.userDetails.uuid });
//         });
//         this.route.get('/logout', this.logout.bind(this));
//     }
// }

// module.exports = new UserAuthRouter().route;


class UserAuthRouter extends UserAuth {
    constructor() {
        super();
        this.route = express.Router();

        /**
         * @swagger
         * /user/register:
         *   post:
         *     summary: Register a new user
         *     tags: [Authentication]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - username
         *               - email
         *               - password
         *             properties:
         *               username:
         *                 type: string
         *                 example: johndoe
         *               email:
         *                 type: string
         *                 example: johndoe@example.com
         *               password:
         *                 type: string
         *                 example: StrongPassword123
         *     responses:
         *       200:
         *         description: Successfully registered
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 username:
         *                   type: string
         *                 email:
         *                   type: string
         *                 uuid:
         *                   type: string
         *       400:
         *         description: Username or email already in use
         *       500:
         *         description: Server error
         */
        this.route.post('/register', this.register.bind(this));

        /**
         * @swagger
         * /user/login:
         *   post:
         *     summary: Log in an existing user
         *     tags: [Authentication]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - username
         *               - password
         *             properties:
         *               username:
         *                 type: string
         *                 example: johndoe
         *               password:
         *                 type: string
         *                 example: StrongPassword123
         *     responses:
         *       200:
         *         description: Successfully logged in
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 username:
         *                   type: string
         *                 email:
         *                   type: string
         *                 uuid:
         *                   type: string
         *       400:
         *         description: Missing credentials or Invalid username/password
         *       401:
         *         description: Invalid credentials
         */
        this.route.post('/login', login, (req, res) => {
            res.status(200).send({ username: req.userDetails.username, email: req.userDetails.email, uuid: req.userDetails.uuid });
        });

        /**
         * @swagger
         * /user/logout:
         *   get:
         *     summary: Log out the current user
         *     tags: [Authentication]
         *     responses:
         *       200:
         *         description: Successfully logged out
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Successfully logged out
         */
        this.route.get('/logout', this.logout.bind(this));
    }
}

module.exports = new UserAuthRouter().route;
