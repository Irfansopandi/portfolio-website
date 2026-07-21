const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectBySlug, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', authenticate, uploadImage('projects').single('image'), createProject);
router.put('/:id', authenticate, uploadImage('projects').single('image'), updateProject);
router.delete('/:id', authenticate, deleteProject);

module.exports = router;
