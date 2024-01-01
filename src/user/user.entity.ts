import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @Column()
    @ApiProperty({ description: 'The phone number of the user' })
    phone_number: string;

    @Column()
    @ApiProperty({ description: 'The email address of the user' })
    email: string;

    @Column()
    @ApiProperty({ description: 'The hobbies of the user' })
    hobbies: string;
}
