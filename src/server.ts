import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { dietsRouter } from './routes/diet'
import { usersRouter } from './routes/users'

const app = fastify()
app.register(cookie)

app.register(usersRouter, { prefix: '/users' })
app.register(dietsRouter, { prefix: '/diets' })

app.listen({ port: 3333 }).then(() => console.log('Server is running ⚡'))
