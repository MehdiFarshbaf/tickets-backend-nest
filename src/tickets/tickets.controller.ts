import {Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Request} from '@nestjs/common';
import {TicketsService} from "./tickets.service";
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {CreateMessageDto} from "./dto/create-message.dto";
import {UpdateTicketStatusDto} from "./dto/update-ticket-status.dto";

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {
    }

    @Post()
    create(@Request() req, @Body() dto: CreateTicketDto) {
        const userId = req.user.id; // بعد از اضافه کردن JWT
        return this.ticketsService.create(userId, dto);
    }

    @Get('my')
    myTickets(@Request() req) {
        return this.ticketsService.findMyTickets(req.user.id);
    }

    @Get()
    allTickets(@Request() req) {
        if (req.user.role !== 'ADMIN') throw new ForbiddenException();
        return this.ticketsService.findAllForAdmin();
    }

    @Get(':id')
    getTicket(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ticketsService.findOne(id, req.user.id, req.user.role);
    }

    @Post(':id/messages')
    addMessage(
        @Param('id', ParseIntPipe) id: number,
        @Body() createMessageDto: CreateMessageDto,
        @Request() req: any,
    ) {
        return this.ticketsService.addMessage(id, req.user.id, createMessageDto, req.user.role);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTicketStatusDto: UpdateTicketStatusDto,
        @Request() req,
    ) {
        return this.ticketsService.updateStatus(id, updateTicketStatusDto, req.user.role);
    }
}
