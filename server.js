const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 30001;

app.use(express.json());

app.use('/signup', (req, res, next) => {
  const bearerheader = req.headers['authorization'];
  if (typeof bearerheader !== 'undefined') {
    const bearer = bearerheader.split(' ');

    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else {
    // status 403 = Forbidden
    res.sendStatus(403);
  }
});

app.get('/', (req, res) => {
  res.send({
    message: process.platform,
    upTime: process.uptime(),
  });
});

app.post('/post', (req, res) => {
  jwt.verify(req.token, 'khufiya', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send({
        message: 'Post created..',
        authData,
      });
    }
  });
});

app.post('/login', (req, res) => {
  const user = {
    user: 'Bilal',
    id: 1,
    email: 'abc@abc.com',
  };
  jwt.sign({ user }, 'khufiya', { expiresIn: '30s' }, (err, token) => {
    res.send({ token });
  });
});

app.listen(port, () => {
  console.log(`server runningm ${port}`);
});
