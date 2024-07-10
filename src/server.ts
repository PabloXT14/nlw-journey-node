import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'

import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'

const app = fastify()
const PORT = 3333

app.register(cors, {
  origin: 'http://localhost:3000',
})

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
app.register(confirmTrip)

app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`Server running on port ${PORT}`))
