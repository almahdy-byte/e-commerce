import { Body, Controller,  Get,  Param,  Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/common/guards/auth.guard';
import { AddTOCart } from './DTO';

@Controller('cart')
export class CartController {
    constructor(private readonly cartServices : CartService) { }
    
    @Post('/:productId')
    @UseGuards(Auth)
    async addToCart(@Req() req: Request , @Body() body: AddTOCart , @Param('productId') productId: any) {
        const user = req['user'];
        return await this.cartServices.addToCart(body, productId, user);
    }

    @Get()
    @UseGuards(Auth)
    async getCart(@Req() req: Request) {
        const user = req['user'];
        return await this.cartServices.getCart(user);
    }
}
