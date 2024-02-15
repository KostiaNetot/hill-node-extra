// hw3 task2:
import fs from 'fs';
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

export { createDefaultDb, processImage }