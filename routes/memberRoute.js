const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.post('/', memberController.addMember);
router.get('/', memberController.getAllMembers);

module.exports = router;