const service = require('../services/admissionServices');

const customerAdmission = async (req, res, next) => {
  try {
    const customerData = req.body;
    const output = await service.admission(customerData);

    return res.status(200).json(output);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

module.exports = {
  customerAdmission,
};
