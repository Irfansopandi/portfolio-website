const express = require('express');
const router = express.Router();
const { getAllSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skill.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', getAllSkills);
router.post('/', authenticate, createSkill);
router.put('/:id', authenticate, updateSkill);
router.delete('/:id', authenticate, deleteSkill);

module.exports = router;
