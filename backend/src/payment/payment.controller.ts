import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { OptionalJWT } from 'src/common/guards/optional-jwt.guard';
import { RequestUser } from 'src/users/users.dto';
import { BuyTicketDto } from './payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('/api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ description: 'Buy tickets' })
  @Post('/events/:eventId/tickets')
  async buyTicket(
    @Body() buyTicketDto: BuyTicketDto,
    @Param('eventId', ParseIntPipe) eventId: number,
    @ReqUser() user?: RequestUser,
  ) {
    const session = await this.paymentService.checkoutTicket({
      ...buyTicketDto,
      userId: user?.id || null,
      eventId: eventId,
    });
    return { url: session.url };
  }

  @ApiExcludeEndpoint(true)
  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    const payload = req.rawBody;

    const event = this.paymentService.verifyWebhookEvent(payload, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        await this.paymentService.handleOnCheckoutSessionCompleted(event);

        return 'Success';
      }
      case 'checkout.session.expired': {
        Logger.log('SESSION EXPIRED');

        await this.paymentService.handleOnCheckoutSessionExpired(event);

        break;
      }
    }
    return payload;
  }

  @ApiExcludeEndpoint(true)
  @Get('/cancel/:eid')
  async cancelCheckoutSession(
    @Param('eid', ParseIntPipe) eventId: number,
    @Query('q', ParseIntPipe) quantity: number,
  ) {
    await this.paymentService.handleOnCheckOutSessionCanceled(eventId, quantity);

    return 'Canceled session';
  }

  @ApiOperation({ description: 'Get payment session' })
  @Get('/session')
  async getPaymentSession(@Query('session_id') sessionId: string) {
    const session = await this.paymentService.getPaymentSession(sessionId);

    return session;
  }
}
