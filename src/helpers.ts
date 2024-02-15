// hw3 task2:
import fs from 'fs';
import { Transform } from 'stream';
import axios from 'axios';
import { promisify } from 'util';
import { ImageRequest } from './types';

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

export { createDefaultDb, processImage, readAndWrite }