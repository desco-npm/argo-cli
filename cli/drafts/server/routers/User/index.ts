import { getConnection, } from 'typeorm'

import { calcLimitOffset, } from '@desco/argo/lib/calcLimitOffset'

export default (app) => {
  app.get('/User', async (req, res) => {
    const { limit, offset, } = calcLimitOffset(req.query.page, 10)

    const users = await getConnection()
      .getRepository('User')
      .createQueryBuilder()
      .orderBy('User.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount()

    res.json(users)
  })
}