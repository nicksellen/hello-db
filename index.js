const app = require('express')();
const morgan = require('morgan');
const pg = require('pg');

const port = process.env.PORT || 3000;

app.use(morgan('combined'));

const postgresConfig = {
  database: process.env. POSTGRES_DB|| 'db',
  host: process.env.POSTGRES_HOST || 'db',
  user: process.env.POSTGRES_USER || 'db',
  password: process.env.POSTGRES_PASSWORD || 'db'
};

const pool = new pg.Pool(postgresConfig);

app.get('/', (req, res) => {
  res.status(200).send('main thing, you can also request /users');
});

app.get('/users', (req, res) => {
  loadUsers((err, users) => {
    if (err) return res.status(500).send(err.message);
    res.send({ users });
  });
});

app.listen(port, () => {
  console.log('listening on port', port);
});

function loadUsers(callback) {
  pool.connect((err, client, done) => {
    if (err) return callback(err);
    client.query('SELECT * FROM users', [], (err, result) => {
      done(err); // release the client back to the pool (or destroy it if there is an error)
      if(err) return callback(err);
      callback(null, result.rows);
    });
  });
}

