import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { OptionalJWT } from 'src/common/guards/optional-jwt.guard';
import { RequestUser } from 'src/users/users.dto';
import { BuyTicketDto } from './payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('/api/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ description: 'Buy tickets' })
  @Post('/events/:eventId/tickets')
  @UseGuards(OptionalJWT)
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
        Logger.log(`SESSION COMPLETED ${event.id}`);
        this.paymentService.handleOnCheckoutSessionCompleted(event);

        return 'Success';
      }
      case 'checkout.session.expired': {
        Logger.log(`SESSION EXPIRED ${event.id}`);

        await this.paymentService.handleOnCheckoutSessionExpired(event);

        break;
      }
      case 'payment_intent.payment_failed': {
        Logger.log(`PAYMENT FAILED: ${event.id}`);

        await this.paymentService.handleOnPaymentFailed(event);

        break;
      }
    }
    return payload;
  }

  @ApiExcludeEndpoint(true)
  @Get('/cancel')
  async cancelCheckoutSession(
    @Query('session_id') sessionId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.paymentService.handleOnCheckOutSessionCanceled(sessionId);

    res.redirect(this.configService.get('CLIENT_URL'));
  }

  @ApiOperation({ description: 'Get payment session' })
  @Get('/session')
  async getPaymentSession(@Query('session_id') sessionId: string) {
    const session = await this.paymentService.getPaymentSession(sessionId);

    return session;
  }
}
