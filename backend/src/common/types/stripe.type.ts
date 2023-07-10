export class CreateSessionArgs {
  currency: string;
  customerEmail: string;
  mode: 'payment';
  cancelUrl: string;
  sucessUrl: string;
  items: any[];
  metadata?: Record<string, any>;
}
