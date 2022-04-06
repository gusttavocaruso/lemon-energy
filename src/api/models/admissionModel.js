const connect = require('./connection');

const register = async (customerPayload, CO2) => {
  const db = await connect();
  await db.collection('customers_approved')
    .insertOne({ ...customerPayload, previsaoEconomiaCO2: CO2 });
};

module.exports = {
  register,
};
