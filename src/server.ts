import fastify from 'fastify'
import { prisma } from './lib/prisma'

const app = fastify()
const PORT = 3333

app.post('/register', async (req, reply) => {
  await prisma.trip.create({
    data: {
      destination: 'Santa Catarina',
      starts_at: new Date(),
      ends_at: new Date(),
    },
  })

  return reply.status(201).send({ message: 'Registro cadastrado com sucesso!' })
})

app.get('/list', async (req, reply) => {
  const trips = await prisma.trip.findMany()

  return reply.status(200).send({ trips })
})

app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`Server running on port ${PORT}`))
