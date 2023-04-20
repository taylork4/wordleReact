import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors({
    origin: 'http://localhost:5173'
  }));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   });
//response.setHeader('Access-Control-Allow-Origin', '*');

const words = ['amber', 'brave', 'catch', 'dream', 'earth', 'flair', 'gloom', 'happy', 'image', 'juice', 'knack', 'latch', 'birth', 'notch', 'olive', 'peace', 'quirk', 'route', 'shrug', 'toast'];

app.get('/wordleReact', (req, res) => {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  res.json({ word: randomWord });
});

app.listen(port, () => {
  console.log(`Wordle server listening at http://localhost:${port}/wordleReact`);
});