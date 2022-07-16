require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const router = require('./routes');

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: "Testing"
  })
})

app.use(express.json());

app.use('/', router)

app.listen(port, () => console.log(`Example app listening on port ${port}`))