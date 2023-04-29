import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../../database'
import { randomUUID } from 'node:crypto'

interface Diet {
  id: string
  name: string
  description: string
  is_diet: boolean
  eat_time: string
}

export const dietsRouter = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, reply) => {
    const { userid } = req.headers
    if (!userid)
      return reply.status(401).send({
        message: 'Unauthorized',
      })
  })

  // POST /diets
  app.post('/', async (req, reply) => {
    const { userid } = req.headers
    const creeateDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
      eat_time: z.string(),
    })

    const { name, description, is_diet, eat_time } =
      creeateDietBodySchema.parse(req.body)

    console.log(is_diet)

    await knex('diets').insert({
      id: randomUUID(),
      name,
      description,
      is_diet,
      eat_time,
      user_id: String(userid),
    })

    return reply.status(201).send()
  })

  // GET /diets
  app.get('/', async (req, reply) => {
    const { userid } = req.headers

    const diets = await knex('diets').where({ user_id: String(userid) })

    return reply.send(diets)
  })

  // GET /diets/:id
  app.get('/:id', async (req, reply) => {
    const { userid } = req.headers

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const diet = await knex('diets')
      .where({ user_id: String(userid), id })
      .first()

    return reply.send(diet)
  })

  // DELETE /diets/:id
  app.delete('/:id', async (req, reply) => {
    const { userid } = req.headers

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    await knex('diets')
      .where({ user_id: String(userid), id })
      .del()

    return reply.status(204).send()
  })

  // PUT /diets/:id
  app.put('/:id', async (req, reply) => {
    const { userid } = req.headers

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const { name, description, is_diet, eat_time } = req.body as Diet

    await knex('diets')
      .where({ user_id: String(userid), id })
      .update({ name, description, is_diet, eat_time })

    return reply.status(204).send()
  })
}
