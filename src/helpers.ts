// hw3 task2:
import fs from 'fs';
import { Transform } from 'stream';
import axios from 'axios';
import { promisify } from 'util';
import { ImageRequest, Event, Order } from './types';
import { ShoppingManager } from './services';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const processImage = async ({ url, path }: ImageRequest): Promise<void> => {
  try {
    const { data } = await axios.get<Buffer>(url, { responseType: 'arraybuffer' });
    await fs.promises.writeFile(path, Buffer.from(data));
  } catch (error) {
    throw error;
  }
}

//check if db.json exist and create if not
const createDefaultDb = () => {
  readFileAsync('db.json', 'utf8')
    .then(data => {
      if (typeof JSON.parse(data) == undefined) return;
    })
    .catch(() => {
      const defaultDb = { users: [] }
      return writeFileAsync('db.json', JSON.stringify(defaultDb, null, ' '))
    })
    .then(() => {
      console.log('Default data created or already exist');
    })
    .catch(err => {
      console.log('Creating default data error: ' + err)
    })
}

const readAndWrite = () => {
  const readable = fs.createReadStream('./src/input.txt', 'utf8');

  const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  });

  const writable = fs.createWriteStream('./src/output.txt', 'utf8');

  readable.on('error', (error) => {
    console.error('Readdable error:', error);
  });

  writable.on('error', (error) => {
    console.error('Writable error:', error);
  });

  writable.on('finish', () => {
    console.log('Result written to output.txt');
  });

  readable.pipe(upperCaseTransform).pipe(writable);
}

const dispatchShoppingEvent = (order: Order): void | false => {
  const shoppingManager = new ShoppingManager();
  
  const isOrder = (obj: any): obj is Order => {
    return (
      Object.values(Event).includes(obj.event) &&
      typeof obj.addToCart === 'boolean' &&
      (typeof obj.price === 'number' || typeof obj.price === 'string') &&
      typeof obj.removed === 'boolean' &&
      typeof obj.sold === 'boolean'
    );
  }

  if (!isOrder(order)) {
    console.log('222 not order!')
    return false;
  }

  switch (order.event) {
    case Event.BUY:
      shoppingManager.on(Event.BUY, (price: Order['price']) => {
        console.log('Buying handler... ', price)
      })
      shoppingManager.buy(order);
      break;

    case Event.ADD_TO_CART:
      shoppingManager.on(Event.ADD_TO_CART, (addToCart: Order['addToCart']) => {
        console.log('Adding to cart handler... ', addToCart)
      })
      shoppingManager.addToCart(order);
    break;

    case Event.REMOVE_FROM_CART:
      shoppingManager.on(Event.REMOVE_FROM_CART, (removed: Order['removed']) => {
        console.log('Removing from cart handler... ', removed)
      })
      shoppingManager.removeFromCart(order);
    break;

    case Event.CHECKOUT:
      shoppingManager.on(Event.CHECKOUT, (sold: Order) => {
        console.log('Removing from cart handler... ', sold)
      })
      shoppingManager.checkout(order);
    break;
  }
}

export { createDefaultDb, dispatchShoppingEvent, processImage, readAndWrite }