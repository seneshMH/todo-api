
## Description

Todo-API using NestJs & MongoDB

## Functionalities

1. Set up MongoDB integration.
2. Create a module for Todo entities.
3. Implement a service to handle CRUD operations for Todo entities.
3. Implement a controller to define RESTful endpoints for Todo entities.
4. Implement error handling middleware for the application.
5. Implement validation using class-validator and class-transformer. 
3. Implement pagination for fetching multiple Todo records.
4. unit tests for controller and  service using Jest.
5. Implement logging for all CRUD operations using NestJS Logger.
6. swagger documentation for the API endpoints. 

## Setup

Start by cloning the repository with `https://github.com/seneshMH/todo-api.git`.

If required, modify the MONGO_URI in `.env`. by default, `localhost` is used. in order to use   `localhost`, MongoDB Server must be installed.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Access Documentation

use `localhost:3000/api/`

![API](/resources/api.png?raw=true "API")

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
