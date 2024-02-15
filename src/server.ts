import fs from 'fs';
import { promisify } from 'util';
import express, { Express, Request, Response } from "express";
import { ImageRequest, User } from "./types";
import { processImage } from './helpers';

const app: Express = express();
app.use(express.json());

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

app.route('/users')
  .get((req: Request, res: Response) => {
    readFileAsync('db.json', 'utf8')
      .then(data => {
        console.log(data);
        res.send(JSON.parse(data));
      })
      .catch(err => {
        console.log('File operation error: ' + err)
      })
  })
  .post((req: Request, res: Response) => { // for now it's just "/users", will changed for more complicated "/api/v1/users" letter on
    readFileAsync('db.json', 'utf8')
      .then(data => {
        const newUser: User = req.body;
        const usersData = JSON.parse(data);
        usersData.users.push(newUser);
        return writeFileAsync('db.json', JSON.stringify(usersData, null, ' '));
      })
      .then(() => {
        res.send('New user added successfully');
      })
      .catch(err => {
        console.log('File operation error: ' + err)
      })
  });

// code from hw3 task2:

// if needed, uncomment following variables for testing:
// const URL: string = 'https://avatars.githubusercontent.com/u/44783119?s=400&u=0fee91000a2c63aefe31572f4796ac07958c56c1&v=4';
// const PATH: string = './image.jpeg';

app.route('/image')
  .post((req: Request<{}, {}, ImageRequest>, res: Response) => {
    processImage(req.body)
      .then(() => {
        res.send('Image downloaded and saved successfully.');
      })
      .catch(err => {
        res.status(500).send('Error downloading or saving image: ' + err);
      })
  })  

export { app };