import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRespository';

class Usercontroller {
    async create (request: Request, response: Response){
        const {name , email}= request.body;
        
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
