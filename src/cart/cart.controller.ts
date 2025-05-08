import { Body, Controller,  Get,  Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/common/guards/auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartServices : CartService) { }
    
    @Post()
    @UseGuards(Auth)
    async addToCart(@Body('') body: any, @Req() req: Request) {
        const user = req['user'];
        return await this.cartServices.addToCart(body, user);
    }

    @Get()
    @UseGuards(Auth)
    async getCart(@Req() req: Request) {
        const user = req['user'];
        return await this.cartServices.getCart(user);
    }
}
