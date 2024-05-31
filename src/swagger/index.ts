import { Application } from 'express'
import fs from 'fs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

// Carga el archivo JSON
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'))

const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

export default setupSwagger
