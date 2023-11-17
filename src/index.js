import 'dotenv/config';
import Server from './service/server.js';

const server = new Server();
server.listen();
