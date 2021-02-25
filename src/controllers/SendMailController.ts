import { Request, Response} from 'express'
import { getCustomRepository } from 'typeorm';
import { SurveyUser } from '../models/SurveyUser';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRespository';

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id} = request.body;

        const userRepository = getCustomRepository(UsersRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const userAlreadyExists =  await userRepository.findOne({email});

        if(!userAlreadyExists){
            return response.status(400).json({
                erro: "user does not exists"
            })
        }

        const surveysAlredyExists = await surveyRepository.findOne({id:survey_id})

        if(!surveysAlredyExists) {
            return response.status(400).json({
                error: "Surveys dos note exists!"
            })
        }

        //salar as informações na tabela

        const surveyUser = surveysUsersRepository.create({
             user_id: userAlreadyExists.id,
             survey_id
         })

        await surveysUsersRepository.save(surveyUser)

        //enviar e-mail para usuário

        return response.json(surveyUser)
    }
}

export { SendMailController}