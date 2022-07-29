import express from 'express'
import {createUserSchema, loginSchema, updateSchema} from '../middleware/joiValidator.js'
import { authentication } from '../middleware/auth.js'
import {registerUser, login, updateUser, getInspectionManager} from '../controllers/Auth/userController.js'

const router = express.Router()

//test API routes
router.get('/test', (req, res) =>{
    console.log("test")
    res.send('Test API user route')
})

router.post('/registerUser', createUserSchema, authentication ,registerUser)
router.get('/login', loginSchema, login)
router.put('/updateUser', updateSchema, authentication, updateUser)
router.get('/inspectionManager',authentication, getInspectionManager)

export default router
