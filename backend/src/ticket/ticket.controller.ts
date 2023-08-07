import { Body, Controller, Get, Logger, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Role } from 'src/common/constants/role.enum';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { RequestUser } from 'src/users/users.dto';
import { FindTicketDto, GetTicketByOrganizerDto, ProcessTicketDto, SendETicketDto } from './ticket.dto';
import { TicketService } from './ticket.service';

@ApiTags('tickets')
@Controller('/api/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get Tickets belong to user' })
  @Get('/users/own')
  @UseGuards(AuthGuard('jwt'))
  async getTicketsByUser(@ReqUser() user: RequestUser) {
    const tickets = await this.ticketService.getTicketsByUser(user.id);

    return tickets;
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get Tickets belong to organizer' })
  @Get('/organizers/:organizerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Organizer)
  async getTicketsByOrganizer(
    @Param('organizerId') organizerId: string,
    @ReqUser() user: RequestUser,
    @Query() getTicketByOrganizerDto: GetTicketByOrganizerDto,
  ) {
    const tickets = await this.ticketService.getTicketsByOrganizer(
      organizerId,
      getTicketByOrganizerDto,
      user,
    );

    return tickets;
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get Ticket information' })
  @Get(':id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getTicket(@Param('id') ticketId: string, @ReqUser() user: RequestUser) {
    const ticket = await this.ticketService.getTicket(ticketId, user);

    return ticket;
  }

  @ApiOperation({ description: 'Find bought ticket' })
  @Post()
  async findTickets(@Body() findTicketDto: FindTicketDto) {
    const tickets = await this.ticketService.findTickets(findTicketDto);

    return tickets;
  }

  @ApiBearerAuth()
  @ApiOperation({
    description:
      'This endpoint is used to verify a ticket and determine whether it should be allowed or rejected.',
  })
  @Put('/process/:id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async processTicket(
    @Param('id') ticketId: string,
    @ReqUser() user: RequestUser,
    @Body() { allow }: ProcessTicketDto,
  ) {
    await this.ticketService.processTicket(ticketId, allow, user);

    return { message: allow ? 'Allowed' : 'Rejected', status: 'success' };
  }

  @Post('send-ticket')
  @UseGuards(ThrottlerGuard)
  @Throttle(3, 60 * 60)
  async sendETicket(@Body() sendETicketDto: SendETicketDto) {
    await this.ticketService.sendETickets(sendETicketDto);

    return { message: 'We send your E-Ticket to the email you provided' };
  }
}
