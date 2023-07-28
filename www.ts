import app from './src/app';
const port = process.env.PORT || '3000';

app.listen(parseInt(port), '0.0.0.0', () => {
  console.log(`Express Started on http://localhost:${port}`);
});
