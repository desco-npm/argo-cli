import { getConnection, } from 'typeorm'

import { User, } from '@entity/User'

export default (app) => {
  app.get('/User', async (req, res) => {
    const users = await getConnection()
      .createQueryBuilder()
      .from(User, 'User')
      .getManyAndCount()

    res.json(users)
  })
}