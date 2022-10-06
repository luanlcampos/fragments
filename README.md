# fragments

An API that will handle the upload and management of files into a cloud storage.

The UI repo can be found [here](https://github.com/luanlcampos/fragments-ui)

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm start` to start the server locally with node
- `npm run dev` to start the local server with nodemon
- `npm run debug` to start the local server with nodemon and listening for a debugging client
- `npm run lint` check for errors

# Code Overview

## Dependencies

- [compression](https://www.npmjs.com/package/compression) -
- [cors](https://www.npmjs.com/package/cors) - Middleware for enabling CORS
- [express](https://expressjs.com/en/4x/api.html) - The server for handling and routing HTTP requests
- [helmet](https://www.npmjs.com/package/helmet) - helps you secure the app by setting various HTTP headers
- [pino](https://www.npmjs.com/package/pino) - node.js logger
- [pino-http](https://www.npmjs.com/package/pino-http) - HTTP logger
- [pino-pretty](https://www.npmjs.com/package/pino-pretty) - logger formatter
- [stoppable](https://www.npmjs.com/package/stoppable) - stop/close the server in the expected way
