const express = require('express');
const router = require('./routes/routes');
const err = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use(router);
app.use(err);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server's on at ${PORT}`));
