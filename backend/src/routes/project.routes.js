const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectBySlug, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadProjectFiles } = require('../middleware/upload.middleware');

router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', authenticate, uploadProjectFiles('projects').fields([{ name: 'image', maxCount: 1 }, { name: 'appFile', maxCount: 1 }]), createProject);
router.put('/:id', authenticate, uploadProjectFiles('projects').fields([{ name: 'image', maxCount: 1 }, { name: 'appFile', maxCount: 1 }]), updateProject);
router.delete('/:id', authenticate, deleteProject);

module.exports = router;
