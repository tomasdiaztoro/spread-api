import { Router } from 'express'
import { getSpreadByMarketIdController, getSpreadsController } from '../controllers/spreadControllers'
import { getAlertsController, createAlertController } from '../controllers/alertControllers'
import { asyncHandler, errorHandler } from '../middlewares/middlewares'

const router: Router = Router()

router.get('/alert/:marketId', asyncHandler(getAlertsController))
router.post('/alert', asyncHandler(createAlertController))
router.get('/spread', asyncHandler(getSpreadsController))
router.get('/spread/:marketId', asyncHandler(getSpreadByMarketIdController))

router.use(errorHandler)

export default router
