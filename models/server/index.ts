import express from 'express'

require('dotenv').config()

export default () => {
  const app = express()
  const port = process.env.EXPRESS_PORT
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
}