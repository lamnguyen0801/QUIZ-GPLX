const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('database.json'); // Đường dẫn tới file JSON của bạn
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3002; // Vercel sẽ tự chọn cổng

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log('JSON Server is running');
});
