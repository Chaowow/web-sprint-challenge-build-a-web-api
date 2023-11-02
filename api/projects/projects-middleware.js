const Project = require('./projects-model');

function logger(req, res, next) {
    const timestamp = new Date().toLocaleDateString();
    const { method, url } = req;
  
    console.log(`Request Method: ${method}, Request URL: ${url}, Timestamp: ${timestamp}`);
    next();
  }

function validateProjectId(req, res, next) {
    const { id } = req.params;

    Project.get(id)
    .then(projects => {
        if (projects) {
            req.projects = projects;
            next();
        } else {
            res.status(404).json({
                message: "Project not found"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error validating project ID' });
    })
}


module.exports = {
    logger,
    validateProjectId,
}