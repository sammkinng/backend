// src/user/dto/send-email.dto.ts
import { IsEmail,IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class SendEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsArray()
    @ArrayNotEmpty()
    ids: number[];
}
