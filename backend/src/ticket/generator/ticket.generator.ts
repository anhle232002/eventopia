export interface TicketGenerator {
  generate: (params: any) => Promise<any>;
}
