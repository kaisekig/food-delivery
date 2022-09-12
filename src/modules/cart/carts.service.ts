import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from '../meals/entities/meals.entity';
import { User } from '../users/entities/users.entity';
import { Cart } from './entities/carts.entities';
import { CartMeal } from './entities/carts.meals.entity';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>, 

        @InjectRepository(Cart)
        private readonly cart: Repository<Cart>, 
    
        @InjectRepository(CartMeal)
        private readonly cartMeal: Repository<CartMeal>,

        @InjectRepository(Meal)
        private readonly meal: Repository<Meal>,
    ) {}

    async getById(id: number): Promise<Cart> {
        return this.cart.findOne({
            where: {
                cartId: id
            }, 
            relations: [
                'user',
                'cartMeals',
                'cartMeals.meal',
                'cartMeals.meal.category',
                'cartMeals.meal.prices',
                'order',
            ]
        });
    }

    async getActiveCartByUserId(userId: number): Promise<Cart | null> {
        const carts: Cart[] = await this.cart.find({
            where: {
                user: {
                    userId: userId
                }
            }, 
            order: {
                createdAt: 'DESC'
            },
            take: 1,
            relations: [
               'order',
               'user'
            ],
        });

        if (!carts || carts.length === 0) {
            return null;
        }

        const cart: Cart = carts[0];
        if ((cart.order !==  null)) {
            return null;
        }

        return cart;
    }

    async createCart(userId: number): Promise<Cart> {
        const user: User = await this.user.findOne({
            where: {
                userId: userId
            }
        });
        
        const newCart: Cart = new Cart();
        newCart.user = user;

        return await this.cart.save(newCart);
    }

    async addToCart(cartId: number, mealId: number, quantity: number): Promise<Cart> {
        const cart: Cart = await this.cart.findOne({ 
            where: {
                cartId: cartId
            }
        });

        const meal: Meal = await this.meal.findOne({
            where: {
                mealId: mealId
            }
        });

        let cartMeal: CartMeal = await this.cartMeal.findOne({
            where: {
                cart: {
                    cartId: cart.cartId
                },
                meal: {
                    mealId: meal.mealId
                }
            }
        });

        if (!cartMeal) {
            cartMeal = new CartMeal();
            cartMeal.cart = cart;
            cartMeal.meal = meal;
            cartMeal.quantity = quantity;

        } else {
            cartMeal.quantity += quantity;
        }

        await this.cartMeal.save(cartMeal);

        return this.getById(cartId);
    }

    async editCartQuantity(cartId: number, mealId: number, quantity: number): Promise<Cart> {
        let cartMeal: CartMeal = await this.cartMeal.findOne({
            where: {
                cart: {
                    cartId: cartId
                }, 
                meal: {
                    mealId: mealId
                }
            }
        });

        if (cartMeal) {
            cartMeal.quantity = quantity;

            if (cartMeal.quantity === 0) {
                await this.cartMeal.delete(cartMeal.cartMealId);
            } else {
                await this.cartMeal.save(cartMeal);
            }
        }

        return await this.getById(cartId);
    }
}