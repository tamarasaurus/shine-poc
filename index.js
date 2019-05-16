

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()

app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next()
})

app.post('/hook', cors(), (req, res) => {
  console.log('body', req.body);
  res.send(200);
});

app.listen(process.env.PORT || '8080', () => console.log(`Example app listening on port 8000`))
