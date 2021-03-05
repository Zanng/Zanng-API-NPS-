import { Request, Response} from "express"
import { getCustomRepository, Not, IsNull } from "typeorm"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"

/**
 * 1 2 3 4 5 6 7 8 9 10
 * detratores => 0 - 6
 * passivos => 7 - 8
 * Promotores => 9 - 10
 * 
 * (Número de Promotores - número de detratores) / (número de respondentes) * 100
 */
class NpsController {
    async execute(request: Request, response: Response){
        const { survey_id } = request.params;
        const serveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveysUsers =  await serveysUsersRepository.find({
            survey_id,
            value:Not(IsNull())
        })

        const detractor = surveysUsers.filter(
            (survey)=> survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveysUsers.filter(
            (surveys)=> surveys.value >= 9 && surveys.value  <=10
        ).length;

        const passive = surveysUsers.filter(
            (surveys)=> surveys.value >=7 && surveys.value <=8
        ).length;

        const totalAnswer = surveysUsers.length;

        const calculate = (((promoters - detractor) / totalAnswer) * 100).toFixed(2)

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswer,
            calculate
        })

    }
}

export { NpsController}