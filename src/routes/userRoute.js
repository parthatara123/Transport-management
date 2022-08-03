import express from 'express'
import {createUserSchema, loginSchema, updateSchema} from '../middleware/joiValidator.js'
import {authentication, allowedRoles} from '../middleware/auth.js'
import {registerUserHandler, loginHandler, logoutHandler} from '../controllers/Auth/userLogin-signup.js'
import {getUserByRoleHandler, updateUserHandler, getInspectionManagerHandler} from '../controllers/Api/userController.js'

const router = express.Router()

//API for user registration
router.post('/register', createUserSchema, authentication, registerUserHandler)

//API for user login
router.get('/login', loginSchema, loginHandler)

//API for user update
router.patch('/update', updateSchema, authentication, allowedRoles(['admin']), updateUserHandler)

//API to get inspection manager data working under procurement manager
router.get('/inspectionManager', authentication, allowedRoles(['admin', 'procurement manager']), getInspectionManagerHandler)

// Get users
router.get('/get', authentication, allowedRoles(['admin']), getUserByRoleHandler);

// Logout
router.get('/logout', logoutHandler);
export default router
