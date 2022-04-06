const connect = require('./connection');

const register = async (customerPayload, CO2) => {
  const db = await connect();
  const { insertedId } = await db
    .collection('customers_approved')
    .insertOne({ ...customerPayload, previsaoEconomiaCO2: CO2 });

  return insertedId;
};

module.exports = {
  register,
};
