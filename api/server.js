const express = require('express');
const { logger } = require('./projects/projects-middleware');
const server = express();
require('dotenv').config();

const projectsRouter = require('./projects/projects-router');

const actionsRouter = require('./actions/actions-router');

server.use(express.json());

server.use(logger);

server.use('/api/projects', projectsRouter);

server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
    res.json({ hello: 'world!' })
});


module.exports = server;
