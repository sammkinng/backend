// src/user/dto/send-email.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class SendEmailDto {
    @ApiProperty({ description: 'Email Address to send mail' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Array of user IDs' })
    @IsArray()
    @ArrayNotEmpty()
    ids: number[];
}
