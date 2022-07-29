import express from 'express'
import { authentication } from '../middleware/auth.js'
import { createBlankChecklistSchema } from '../middleware/joiValidator.js'
import {createBlankChecklist , getChecklistByClientId} from '../controllers/Api/checklistController.js'
const router = express.Router()

//test API routes
router.get('/test', (req, res) =>{
    console.log("test")
    res.send('Test API user route')
})

router.post('/createBlankChecklist', createBlankChecklistSchema, authentication ,createBlankChecklist)
router.get('/getChecklist/:clientId', authentication, getChecklistByClientId)
export default router