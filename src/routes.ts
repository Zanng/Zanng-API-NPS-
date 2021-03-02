import { Router } from 'express'
import { SurveysController } from './controllers/SurveysController';
import { Usercontroller } from './controllers/UserController'
import { SendMailController} from './controllers/SendMailController'
import { AnswerController } from './controllers/AnsweController';

const router = Router()

const userController = new Usercontroller(); 
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();

router.post("/users",userController.create)
router.post("/surveys",surveysController.create)
router.get("/surveys",surveysController.show)

router.post("/sendMail", sendMailController.execute)
router.get("/answers/:value",answerController.execute)
export { router };