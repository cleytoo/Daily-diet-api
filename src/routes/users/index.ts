import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../../database'
import { randomUUID } from 'node:crypto'

export const usersRouter = async (app: FastifyInstance) => {
  app.post('/', async (req, reply) => {
    const createYserBosySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createYserBosySchema.parse(req.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })

  app.get('/metrics/:id', async (req, reply) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const diets = await knex('diets').where({ user_id: id })

    const metrics = diets.reduce(
      (acc, item) => {
        acc.total += 1
        item.is_diet ? (acc.totalDiet += 1) : (acc.totalNotDiet += 1)

        return acc
      },
      {
        total: 0,
        totalDiet: 0,
        totalNotDiet: 0,
      },
    )

    return reply.status(200).send(metrics)
  })
}
