import fastify from "fastify";

const app = fastify()
const PORT = 3333

app.get('/', async () => {
  return 'Hello World'
})

app.listen({
  port: PORT
}).then(() => console.log(`Server running on port ${PORT}`))
