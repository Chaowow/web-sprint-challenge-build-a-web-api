const express = require('express');

const { validateProjectId } = require('./projects-middleware');

const Project = require('./projects-model');

const router = express.Router();

router.get('/', (req, res, next) => {
  Project.get()
  .then(projects => {
    if(projects === 0){
      res.json([]);
    } else {
      res.json(projects);
    }
  })
  .catch(next);
});

router.get('/:id', validateProjectId, (req, res) => {
  res.json(req.projects)
});

router.post('/', (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400).json({
      message: 'Missing required fields: name and description',
    });
  } else {
    Project.insert({ name, description, completed: true })
      .then((newProject) => {
        res.status(201).json(newProject);
      })
      .catch(next);
  }
});

router.put('/:id', validateProjectId, (req, res, next) => {
  const { name, description, completed } = req.body;

  if (!name || !description || completed === undefined) {
    res.status(400).json({
      message: 'Missing required fields: name, description, or completed',
    });
  } else {
    Project.update(req.params.id, { name, description, completed })
      .then(updatedProject => {
        if (updatedProject) {
          res.status(200).json(updatedProject);
        } 
      })
      .catch(next);
  }
});

router.delete('/:id', validateProjectId, async (req, res, next) => {
  const { id } = req.params;

  try {
    await Project.remove(id);
    res.status(204).end(); 
  } catch (error) {
    next(error);
  }
});

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
  try {
    const actions = await Project.getProjectActions(req.params.id);
    if (actions === 0) {
      res.json([]);
    } else {
      res.json(actions);
    }
  } catch (error) {
    next(error);
  }
});


router.use((err, req, res, next) => { //eslint-disable-line 
  res.status(err.status || 500).json({
    customMessage: 'Something went wrong',
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;