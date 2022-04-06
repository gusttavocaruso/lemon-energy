const connect = require('./connection');

const register = async (customerPayload) => {
  const db = await connect();
  const { insertedId } = await db
    .collection('customers_approved')
    .insertOne({ customerPayload });

  return insertedId;
};

module.exports = {
  register,
};
