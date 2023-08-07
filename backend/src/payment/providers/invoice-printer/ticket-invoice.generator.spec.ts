import { TicketInvoiceGenerator } from './ticket-invoice.generator';

describe('Ticket invoice', () => {
  it('generated pdf', async () => {
    const generator = new TicketInvoiceGenerator();
    const file = await generator.generate({
      eventDate: new Date(),
      eventName: 'Test',
      quantity: 3,
      ticketPrice: 3,
      total: 9,
      promotion: null,
    });

    // expect(file).toBeDefined();
    expect(file).toContain('invoice');
  });
});
