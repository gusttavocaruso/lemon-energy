const { Router } = require('express');
const controller = require('../controllers/admissionController');

const router = Router();

router.post('/admittance', controller.customerAdmission);

module.exports = router;
