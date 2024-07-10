import fastify from 'fastify'
import { createTrip } from './routes/create-trip'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { confirmTrip } from './routes/confirm-trip'

const app = fastify()
const PORT = 3333

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
