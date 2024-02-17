import EventEmitter from 'events';
import { Event, Order } from './types';

export class ShoppingManager extends EventEmitter {
  stock: number;

  constructor() {
    super();
    this.stock = 20;
  }
  
  buy(order: Order) {
    const { price } = order;
    console.log('Hello from ShoppingManager buy');
    this.emit(Event.BUY, price);
  }

  addToCart(order: Order) {
    const { addToCart } = order;
    console.log('Hello from ShoppingManager addToCart');
    this.emit(Event.ADD_TO_CART, addToCart);
  }

  removeFromCart(order: Order) {
    const { removed } = order;
    console.log('Hello from ShoppingManager removeFromCart');
    this.emit(Event.REMOVE_FROM_CART, removed);
  }

  checkout(order: Order) {
    this.stock--;
    this.emit(Event.CHECKOUT, order);
  }
}