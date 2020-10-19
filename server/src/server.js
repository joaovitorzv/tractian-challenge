import App from './app';

App.listen(3333 | process.env.PORT, () => {
  console.log('> Server running');
});