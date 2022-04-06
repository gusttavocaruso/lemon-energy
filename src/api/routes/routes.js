const { Router } = require('express');
const controller = require('../controllers/admissionController');
const lp = require('../middlewares/landingPage');

const router = Router();

router.get('/', lp);
router.post('/admittance', controller.customerAdmission);

module.exports = router;
