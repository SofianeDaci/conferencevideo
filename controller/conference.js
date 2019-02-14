var Project = require("../models/conference");

class ConferenceControler {
    async add(req, res) {

        const newProject = new Project({
            title: req.body.title,
            description: req.body.description,
            submitDate: req.body.submitDate,
            submittedBy: req.user.username
        });
        try {
            res.json({ success: true, msg: 'Le nouveau projet à été crée avec succès' });
        }
        catch (err) {
            return res.json({ success: false, msg: 'La sauvegarde du projet à échoué' });
        }
    }

    async get(req, res) {
        try {
            let projects = await Project.find({ submittedBy: req.user.username }).lean().exec();
            return res.json(projects);
        }
        catch (err) {
            return next(err);
        }

    }
}

exports.default = new ConferenceControler();

module.exports = exports['default'];