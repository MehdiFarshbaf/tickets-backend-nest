import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from '../common/enums/ticket-status.enum';
import { Role } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  // Create a new ticket with the first message
  async create(userId: number, createTicketDto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: createTicketDto.title,
        ownerId: userId,
        status: TicketStatus.OPEN,
        priority: 'MEDIUM', // can be enhanced later
        messages: {
          create: {
            content: createTicketDto.firstMessage,
            authorId: userId,
            is_admin: false,
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        messages: {
          include: { author: { select: { id: true, name: true, role: true } } },
          orderBy: { created_at: 'asc' },
        },
      },
    });
  }

  // Get current user's tickets
  async findMyTickets(userId: number) {
    return this.prisma.ticket.findMany({
      where: { ownerId: userId },
      include: {
        messages: {
          include: { author: { select: { id: true, name: true, role: true } } },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // Admin: get all tickets
  async findAllForAdmin() {
    return this.prisma.ticket.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        messages: {
          include: { author: { select: { name: true, role: true } } },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // Get a single ticket with access control
  async findOne(id: number, userId: number, userRole: Role) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, email: true } },
        messages: {
          include: { author: { select: { name: true, role: true } } },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return ticket;
  }

  // Add a message to the ticket
  async addMessage(
    ticketId: number,
    userId: number,
    dto: CreateMessageDto,
    userRole: Role,
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.message.create({
      data: {
        content: dto.content,
        ticketId,
        authorId: userId,
        is_admin: userRole === Role.ADMIN,
      },
      include: { author: { select: { name: true, role: true } } },
    });
  }

  // Admin only: update ticket status
  async updateStatus(
    ticketId: number,
    dto: UpdateTicketStatusDto,
    userRole: Role,
  ) {
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can change ticket status');
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: dto.status },
    });
  }
}
