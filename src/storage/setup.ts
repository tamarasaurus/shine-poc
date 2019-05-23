import query from './query';
import pg from 'pg'

query(
  `CREATE TABLE IF NOT EXISTS
  inspection (
    id SERIAL UNIQUE PRIMARY KEY NOT NULL,
    commit TEXT NOT NULL,
    user TEXT NOT NULL,
    name TEXT NOT NULL,
    repository TEXT NOT NULL,
    data JSONB
    created timestamp NOT NULL DEFAULT current_timestamp
  )
  `, [])
.then((QueryResult: pg.QueryResult) => {
  console.log('Created database table \n', QueryResult);
})
.catch((error: Error) => {
  console.error('Error setting up database table \n', error);
});
