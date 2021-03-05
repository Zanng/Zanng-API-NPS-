import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRespository';
import * as yup from 'yup'

class Usercontroller {
    async create (request: Request, response: Response){
        const {name , email}= request.body;
        
        const schema = yup.object().shape({
            name: yup.string().required("nome é obrigatório"),
            email: yup.string().email().required("email deve ser valido")
        })

       /*  if(! (await schema.isValid(request.body))){
            return response.status(400).json({erro: "validations Failed!"})
        } */

        try {
            await schema.validate(request.body, { abortEarly: false})
        }catch (err) { 
            return response.status(400).json({err})
        }

        const usersRepository =  getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email,
        });

        if(userAlreadyExists){
            return response.status(400).json({
                erro: "user already exists!"
            });
        }

        const user = usersRepository.create({
            name, email
        })

        await usersRepository.save(user);

        return response.status(201).json(user);

    }
}

export { Usercontroller };
