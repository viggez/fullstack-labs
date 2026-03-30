const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_code: { type: String, required: true, unique: true },
  project_name: { type: String, required: true },
  project_description: { type: String, required: true }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
