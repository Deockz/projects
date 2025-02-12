import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const client = new pg.Client({
  user: 'postgres',
  password: 'DckzDB15!',
  host: 'localhost',
  port: 5432,
  database: 'books',
})
client.connect();

let result = await client.query('SELECT * FROM book_list')

function sortItems (items,criteria){
  let aux = []
  for (let i = 0; i < items.length -1; i++) {
    for (let j = 0; j < items.length -1; j++) {
      if(criteria == 'score' || criteria == 'read_date'){
        if (eval('items[j].' + criteria) < eval('items[j+1].' + criteria)) {
          aux = items[j];
          items[j] = items[j+1];
          items[j+1] = aux;
        } 
      }else{
        if (eval('items[j].' + criteria) > eval('items[j+1].' + criteria)) {
          aux = items[j];
          items[j] = items[j+1];
          items[j+1] = aux;
        } 
      }
          
    }
  }
  return items;
}


app.get('/', async (req, res) => {
  result = await client.query('SELECT * FROM book_list')
    res.render('index.ejs',{ data : result.rows})
  })

app.post('/', async (req, res) => {
  result = await client.query('SELECT * FROM book_list')
  result = sortItems(result.rows,req.body.order)
  console.log(result)
  res.render('index.ejs',{ data : result})
  })

app.get('/new', (req, res) => {
  res.render('newBook.ejs')
})

app.post('/new', async(req, res) => {
  await client.query('INSERT INTO book_list (name,author,photoid,read_date,score,opinion) VALUES ($1,$2,$3,$4,$5,$6)',[
    req.body.name,
    req.body.author,
    req.body.photoid,
    req.body.read_date,
    req.body.score,
    req.body.opinion
  ])
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
