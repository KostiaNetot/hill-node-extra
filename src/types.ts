export type User = {
  login: string
  password: string
}

// for hw3 task2:
export type ImageRequest = {
  url: string;
  path: string;
};

export enum Event {
  BUY = 'buy',
  ADD_TO_CART = 'addToCart',
  REMOVE_FROM_CART = 'removeFromCart',
  CHECKOUT = 'checkout',
}

export type Order = {
  event: Event;
  addToCart: boolean;
  price: number | string;
  removed: boolean;
  sold: boolean;
};