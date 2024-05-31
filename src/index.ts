import express, { Express } from 'express'
import setupSwagger from './swagger/index'
import routes from './routes/routes'

const app: Express = express()
const port: number = 3000

app.use(express.json())
setupSwagger(app)

app.use('/', routes)

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`)
})
