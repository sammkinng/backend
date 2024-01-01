// src/user/user.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SendEmailDto } from './dto/send-email.dto';
import * as nodemailer from 'nodemailer';
import { ApiOperation ,ApiResponse,ApiBody,ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users', description: 'Retrieve a list of all users.' })
    @ApiResponse({ status: 200, description: 'List of users successfully retrieved.', type: [User] })
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a user by their ID.' })
    @ApiResponse({ status: 200, description: 'User successfully retrieved.', type: User })
    findById(@Param('id') id: string): Promise<User> {
        return this.userService.findById(+id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user', description: 'Create a new user with the provided data.' })
    @ApiBody({ type: User })
    @ApiResponse({ status: 201, description: 'User successfully created.', type: User })
    create(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user by ID', description: 'Update a user with the provided data.' })
    @ApiBody({ type: User })
    @ApiResponse({ status: 200, description: 'User successfully updated.', type: User })
    update(@Param('id') id: string, @Body() user: User): Promise<User> {
        return this.userService.update(+id, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID', description: 'Delete a user by their ID.' })
    @ApiResponse({ status: 204, description: 'User successfully deleted.' })
    remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(+id);
    }

    @Post('send-email')
    @ApiOperation({ summary: 'Send email to users', description: 'Send an email to a list of users.' })
    @ApiBody({ type: SendEmailDto })
    @ApiResponse({ status: 200, description: '{"message":"Email sent successfully.",url:"http://ethereal-URL}' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 500, description: 'User with Id 1 not found' })
    async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<{
        message: string,
        etherealURL: string
    }> {
        try {
            const users = await Promise.all(sendEmailDto.ids.map((id) => this.userService.findById(id)));

            //Formatting the dat in the form of a table
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
