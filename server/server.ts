const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();
const db = require('./db.json');
const fs = require('fs');


server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res, next) => { 
  const users = readUsers()

  const user = users.filter(
    u => u.username === req.body.username && u.password === req.body.password && u.role === req.body.role
  )[0];

  if (user) {
    res.send({ ...formatUser(user), id_token: checkIfAdmin(user) });
  } else {
    res.status(401).send(JSON.stringify({title: 'Incorrect username or password', users: users}));
  }
});

server.post('/login-customer', (req, res, next) => { 
  const customers = readCustomers();

  const customer = customers.filter(
    u => u.email === req.body.email && u.password === req.body.password 
  )[0];

  if (customer) {
    res.send({ ...formatUser(customer), id_token: checkIfAdmin(customer) });
  } else {
    res.status(401).send(JSON.stringify({title: 'Incorrect email or password', uc: customer}));
  }
});

server.post('/register', (req, res) => {
  const db = router.db; // Assign the lowdb instance
  const users = db.get('users');
  const readUserData = readUsers();

  const user = readUserData.filter(u => u.username === req.body.username)[0];

  if (user === undefined || user === null) {
    const data = { 
      ...req.body,
      id_token: checkIfAdmin(req.body), 
      id: readUserData.length + 1
    }
    res.send(data);
    users.push(data).write();

  } else {
    res.status(500).send(JSON.stringify({title: 'User already exists'}));
  }
});

server.use('/users', (req, res, next) => {
  const users = readUsers();
  const user = users.filter(u => u.username === req.body.username)[0];

  if (user === undefined || user === null) {
    res.send({
      ...formatUser(req.body),
      id_token: checkIfAdmin(req.body), users: db.users
    });
    db.users.push(req.body);
  } else {
    res.status(500).send(JSON.stringify({title: 'User already exists'}));
  }
  next();

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
  return user.role === ('ROLE_ADMIN' || 'ROLE_CUSTOMER') || bypassToken === true
    ? 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOIiwidXNlckRldGFpbHMiOnsiZmlyc3ROYW1lIjoiYWRtaW4iLCJsYXN0TmFtZSI6ImFkbWluIn0sImV4cCI6MTY0MDI1MDIyNH0.FGWZ9dQJzCB49oavWjNT7hhm4YiJ3p8oRqfwM0FP2RUiY0FZ-MQo1J1_fujKCAKrRuwZ1Sjeka5_HuroSis5pA' 
    : 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOIiwidXNlckRldGFpbHMiOnsiZmlyc3ROYW1lIjoiYWRtaW4iLCJsYXN0TmFtZSI6ImFkbWluIn0sImV4cCI6MTY0MDI1MDIyNH0.FGWZ9dQJzCB49oavWjNT7hhm4YiJ3p8oRqfwM0FP2RUiY0FZ-MQo1J1_fujKCAKrRuwZ1Sjeka5_HuroSis5pA'
}

function isAuthorized(req) {
  return req.headers.authorization === 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOIiwidXNlckRldGFpbHMiOnsiZmlyc3ROYW1lIjoiYWRtaW4iLCJsYXN0TmFtZSI6ImFkbWluIn0sImV4cCI6MTY0MDI1MDIyNH0.FGWZ9dQJzCB49oavWjNT7hhm4YiJ3p8oRqfwM0FP2RUiY0FZ-MQo1J1_fujKCAKrRuwZ1Sjeka5_HuroSis5pA' ? true : false;
}

function readUsers() {
  const dbRaw = fs.readFileSync('./server/db.json');  
  const users = JSON.parse(dbRaw).users
  return users;
}

function readCustomers() {
  const dbRaw = fs.readFileSync('./server/db.json');  
  const customers = JSON.parse(dbRaw).customers
  return customers;
}