// src/user/user.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SendEmailDto } from './dto/send-email.dto';
import * as nodemailer from 'nodemailer';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<User> {
        return this.userService.findById(+id);
    }

    @Post()
    create(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() user: User): Promise<User> {
        return this.userService.update(+id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(+id);
    }

    @Post('send-email')
    async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<{
        message: string,
        etherealURL: string
    }> {
        try {
            const users = await Promise.all(sendEmailDto.ids.map((id) => this.userService.findById(id)));

            let rows = ''

            users.forEach(user => {
                rows += `
                <tr>
                <td>
                    ${user.name}
                </td>
                <td>
                    ${user.phone_number}
                </td>
                <td>
                    ${user.email}
                </td>
                <td colspan="3">
                    ${user.hobbies}
                </td>
            </tr>
                `
            })

            let msg = `
            <style>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #D6EEEE;
}
</style>
<h1>Please find your data!</h1>
            <table style="width:100%">
    <thead>
        <tr>
        <th>
            Name
        </th>
        <th>
            Phone Number
        </th>
        <th>
            Email
        </th>
        <th >
            Hobbies
        </th>
    </tr>
    </thead>
    <tbody>
        ${rows}
    </tbody>
</table>
            `;


            // Logic to send email using nodemailer
            // Nodemailer configuration

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "maddison53@ethereal.email",
                    pass: "jn7jnAPss4f63QBp6D",
                }
            });


            // Email options
            const mailOptions = {
                from: "maddison53@ethereal.email",
                to: sendEmailDto.email,
                subject: 'Here is the data you requested!',
                html: msg,
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);

            return {
                message: 'Email sent successfully',
                etherealURL: nodemailer.getTestMessageUrl(info)
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
