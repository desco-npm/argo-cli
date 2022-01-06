import User from './User'

export default (app) => {
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  User(app)
}