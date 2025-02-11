import express from 'express';
import pg from 'pg';

const app = express()
const port = 3000

const client = new pg.Client({
  user: 'postgres',
  password: 'DckzDB15!',
  host: 'localhost',
  port: 5432,
  database: 'books',
})
client.connect();


let result = await client.query('SELECT * FROM book_list')


app.get('/', (req, res) => {
    res.render('index.ejs',{ data : result.rows})
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })