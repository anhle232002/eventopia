import { Test, TestingModule } from '@nestjs/testing';
import { TicketFactory } from './ticket.factory';

describe('Ticket factory', () => {
  it('should generate pdf ticket', () => {
    jest.useFakeTimers();

    const factory = new TicketFactory();
    expect(
      factory.createTicket('PDF').generate({
        eventName: 'alo123123123',
        eventDate: 'alo123123123',
        eventLocation: 'alo123123123',
        eventCity: 'alo123123123',
        eventCountry: 'alo123123123',
        eventDuration: 'alo123123123',
        ticketId: 'alo123123123',
        ticketType: 'alo123123123',
        attendeeName: 'alo123123123',
      }),
    ).toBeTruthy();
  });
});
