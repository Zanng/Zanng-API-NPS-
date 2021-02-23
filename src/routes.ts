import { Router } from 'express'
import { Usercontroller } from './controllers/UserController'

const router = Router()

const userController = new Usercontroller(); 

router.post("/users",userController.create)

export { router };