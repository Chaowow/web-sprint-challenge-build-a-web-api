const express = require('express');

const { validateActionId } = require('./actions-middlware');

const Action = require('./actions-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Action.get()
    .then(actions => {
      if(actions === 0){
        res.json([]);
      } else {
        res.json(actions);
      }
    })
    .catch(next);
  });

router.get('/:id', validateActionId, (req, res) => {
    res.json(req.actions);
});

router.post('/', (req, res, next) => {
    const { notes, description, project_id } = req.body;

    if (!notes || !description || !project_id) {
        res.status(400).json({
            message: 'Missing required fields: notes and description or project id'
        });
    } else {
        Action.insert({ notes, description, project_id })
            .then((newAction) => {
                res.status(201).json(newAction);
            })
        .catch(next);
    }
});

router.put('/:id', validateActionId, (req, res, next) => {
    const { notes, description, completed, project_id } = req.body;
  
    if (!notes || !description || completed === undefined || !project_id) {
      res.status(400).json({
        message: 'Missing required fields: notes, description, or completed or project id',
      });
    } else {
      Action.update(req.params.id, { notes, description, completed, project_id })
        .then(updatedAction => {
          if (updatedAction) {
            res.status(200).json(updatedAction);
          } 
        })
        .catch(next);
    }
  });
  

router.delete('/:id', validateActionId, async (req, res, next) => {
    const { id } = req.params;
  
    try {
      await Action.remove(id);
      res.status(204).end(); 
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