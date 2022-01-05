import express from 'express'
{{IMPORTS}}

import routers from './routers'

require('dotenv').config()

export default () => {
  const app = express()
  const port = process.env.EXPRESS_PORT

  {{USES}}

  {{STATICS}}
  
  routers(app)
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
}