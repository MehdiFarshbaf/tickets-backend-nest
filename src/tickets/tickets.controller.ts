import {
    Body,
    Controller,
    ForbiddenException,
    Get, HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
    Res
} from '@nestjs/common';
import {TicketsService} from "./tickets.service";
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {CreateMessageDto} from "./dto/create-message.dto";
import {UpdateTicketStatusDto} from "./dto/update-ticket-status.dto";
import type {RequestWithUser} from "../common/types/request-with-user.type";
import type {Response} from "express";

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {
    }

    @Post()
    async create(@Request() req: RequestWithUser, @Body() dto: CreateTicketDto, @Res() res: Response) {
        const userId = req.user.id;
        const ticket = await this.ticketsService.create(userId, dto);
        res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'Ticket created',
            data: ticket,
        });
    }

    @Get('my')
    async myTickets(@Request() req) {
        return this.ticketsService.findMyTickets(req.user.id);
    }

    @Get()
    async allTickets(@Request() req) {
        if (req.user.role !== 'ADMIN') throw new ForbiddenException();
        return this.ticketsService.findAllForAdmin();
    }

    @Get(':id')
    async getTicket(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ticketsService.findOne(id, req.user.id, req.user.role);
    }

    @Post(':id/messages')
    async addMessage(
        @Param('id', ParseIntPipe) id: number,
        @Body() createMessageDto: CreateMessageDto,
        @Request() req: any,
    ) {
        return this.ticketsService.addMessage(id, req.user.id, createMessageDto, req.user.role);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTicketStatusDto: UpdateTicketStatusDto,
        @Request() req,
    ) {
        return this.ticketsService.updateStatus(id, updateTicketStatusDto, req.user.role);
    }
}
