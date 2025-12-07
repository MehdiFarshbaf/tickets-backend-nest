import {IsEnum, IsNotEmpty} from 'class-validator';
import { TicketStatus } from '@prisma/client'

export class UpdateTicketStatusDto {
    @IsEnum(TicketStatus, {
        message: 'وضعیت باید یکی از این مقادیر باشد: OPEN, IN_PROGRESS, RESOLVED, CLOSED',
    })
    @IsNotEmpty()
    status: TicketStatus;
}