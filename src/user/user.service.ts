// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findById(id: number): Promise<User> {
        const user= await this.userRepository.findOne({where :{id}});
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async update(id: number, user: User): Promise<User> {
        await this.findById(id); // Check if the user exists

        await this.userRepository.update(id, user);
        return this.userRepository.findOne({where :{id}});
    }

    async remove(id: number): Promise<void> {
        const user = await this.findById(id); // Check if the user exists

        await this.userRepository.remove(user);
    }
}
