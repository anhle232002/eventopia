import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { CreateSessionArgs } from '../types/stripe.type';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    try {
      this.stripe = new Stripe(configService.get<string>('STRIPE_API_KEY'), {
        apiVersion: '2022-11-15',
      });
    } catch (error) {
      Logger.error(`Error connect to stripe`, 'Stripe');
      throw new Error('STRIPE: Error connect to Stripe');
    }
  }

  createSession(args: CreateSessionArgs) {
    return this.stripe.checkout.sessions.create({
      currency: args.currency,
      line_items: args.items,
      customer_email: args.customerEmail,
      mode: args.mode,
      metadata: args.metadata,
      cancel_url: args.cancelUrl,
      success_url: args.sucessUrl,
      after_expiration: {
        recovery: { enabled: true },
      },
      expires_at: Math.round(Date.now() / 1000) + 30 * 60,
    });
  }

  constructEvent(payload, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }

  retrieveSessionWithItems(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  }
}
