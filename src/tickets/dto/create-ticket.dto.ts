import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
    @IsNotEmpty({ message: 'عنوان الزامی است' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'محتوای پیام اول الزامی است' })
    @IsString()
    firstMessage: string;
}