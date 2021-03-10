import { Request, Response} from 'express'
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRespository';
import sendMailService from '../services/sendMailService';
import {resolve} from 'path'
import { AppError } from '../errors/AppErro';

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id} = request.body;

        const userRepository = getCustomRepository(UsersRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user =  await userRepository.findOne({email});

        

        if(!user){
            throw new AppError ("user does not exists")
            
        }
        

        const survey = await surveyRepository.findOne({id:survey_id})

        if(!survey) {
            return response.status(400).json({
                error: "Surveys dos note exists!"
            });
        }

     
        const npsPath = resolve(__dirname, "..","views","emails", "npsMail.hbs");


        const surveyUserAlreayExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"],
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id:"",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreayExists){
            variables.id = surveyUserAlreayExists.id
            await sendMailService.execute(email,survey.title, variables,npsPath);
            return response.json(surveyUserAlreayExists)
        }
        //salvar as informações na tabela

        const surveyUser = surveysUsersRepository.create({
             user_id: user.id,
             survey_id
         });

        await surveysUsersRepository.save(surveyUser);

        //enviar e-mail para usuário
         variables.id = surveyUser.id
       
        await sendMailService.execute(email,survey.title, variables, npsPath );

        return response.json(surveyUser);
    }
}

export { SendMailController}