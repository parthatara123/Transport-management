import express from 'express'
import { authentication, allowedRoles } from '../middleware/auth.js'
import { createBlankChecklistSchema, createFilledChecklistSchema } from '../middleware/joiValidator.js'
import { createBlankChecklistHandler, getChecklistByClientIdHandler, fillChecklistHandler } from '../controllers/Api/checklistController.js'

const router = express.Router()

// API to create blank checklist
router.post('/create/blank', createBlankChecklistSchema, authentication, allowedRoles(["admin", "procurement manager"]), createBlankChecklistHandler)

// API to get all blank checklists
router.get('/get/blank/:clientId', authentication, allowedRoles(["admin", "procurement manager", "inspection manager"]), getChecklistByClientIdHandler)


// API to fill checklist and link it checklist to order
router.post('/register/fill/:orderId', createFilledChecklistSchema, authentication, allowedRoles(["inspection manager"]), fillChecklistHandler)

export default router
