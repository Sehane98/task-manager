const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();
const db = require('./db.json');
const fs = require('fs');

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res, next) => { 
  const users = readUsers();

  const user = users.filter(
    u => u.username === req.body.username && u.password === req.body.password
  )[0];

  if (user) {
    res.send({ ...formatUser(user), id_token: checkIfAdmin(user) });
  } else {
    res.status(401).send(JSON.stringify({title: 'Incorrect username or password'}));
  }
});

server.post('/register', (req, res) => {
  const users = readUsers();
  const user = users.filter(u => u.username === req.body.username)[0];

  if (user === undefined || user === null) {
    res.send({
      ...formatUser(req.body),
      id_token: checkIfAdmin(req.body)
    });
    db.users.push(req.body);
  } else {
    res.status(500).send('User already exists');
  }
});

server.use('/users', (req, res, next) => {
  if (isAuthorized(req) || req.query.bypassAuth === 'true') {
    next();
  } else {
    res.sendStatus(401);
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});

function formatUser(user) {
  delete user.password;
  
  return user;
}

function checkIfAdmin(user, bypassToken = false) {
  console.log(user)
  return user.role === ('ROLE_ADMIN' || 'ROLE_USER') || bypassToken === true
    ? 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZXZlbG9wZXIiLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYzNzUxNTQzMn0.3J88cu7W2h_pT_uJrB5scucm_kCSCT1LlhFgQ-Zg-7riRdcrVN8Q3hdpLP3l3qYja06sOlKUYTbnwHVebwWWiQ' 
    : 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZXZlbG9wZXIiLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYzNzUxNTQzMn0.3J88cu7W2h_pT_uJrB5scucm_kCSCT1LlhFgQ-Zg-7riRdcrVN8Q3hdpLP3l3qYja06sOlKUYTbnwHVebwWWiQ'
}

function isAuthorized(req) {
  return req.headers.authorization === 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZXZlbG9wZXIiLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYzNzUxNTQzMn0.3J88cu7W2h_pT_uJrB5scucm_kCSCT1LlhFgQ-Zg-7riRdcrVN8Q3hdpLP3l3qYja06sOlKUYTbnwHVebwWWiQ' ? true : false;
}

function readUsers() {
  const dbRaw = fs.readFileSync('./server/db.json');  
  const users = JSON.parse(dbRaw).users
  return users;
}