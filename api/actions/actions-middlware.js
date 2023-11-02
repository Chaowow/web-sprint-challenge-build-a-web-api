const Action = require('./actions-model');

function validateActionId(req, res, next) {
    const { id } = req.params;

    Action.get(id)
    .then(actions => {
        if (actions) {
           req.actions = actions;
           next();
        } else {
            res.status(404).json({
                message: "Action not found"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error validating action ID' });
    })
}

module.exports = {
    validateActionId
}