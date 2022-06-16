# Netflix-clone

## Tech stack

- [Next.js](https://github.com/vercel/next.js/) ∙ [SWR](https://github.com/vercel/swr)

  - React based Framework & data fetching

- [Styled Components](https://github.com/styled-components/styled-components)

  - Runtime Css in Js library

- [Node.js](https://github.com/nodejs/) ∙ [Express.js](https://github.com/expressjs/express) ∙ [JWT](https://github.com/auth0/node-jsonwebtoken)

  - Web server & using RESTful api with stateless session managment

- [MongoDB](https://github.com/mongodb/mongo) ∙ [Mongoose](https://github.com/Automattic/mongoose)

  - persisted database for users and movie genres

- [Redis](https://github.com/redis/redis)
  - for storing and caching movies data

## Implementation Highlights

- Single page application web client with Nextjs(React framework)
- REST for client server communication
- Fetch Movies data from TMDB
- MongoDB for Users database
- Redis for caching data

## User Stories

- users can register and log in to their account
- landing page has collections of movie for recommendations
- users can select and view details of a movie
- users can add or remove movie to his/her bookmark

## Plans for Expansion

- Make a search into its own service that utilize ElasticSearch indexing Redis database and sync data between ElasticSearch and Redis
- Use Apache Kafka to build real-time streaming data pipelines and real-time streaming?
- Machine Learning recommendation system?
- scrape and stream videos for movies?

# Getting Started

## Prerequisites

**!important** .env file is required for setting up environment variables for this project

## Serving application

### Api (Express Server)

- Depends on MongoDB as a Datasource
- Install Dependencies

```
cd api
yarn install
yarn watch
yarn dev
```

Application will be serving on http://localhost:8080

### Web Client

- install dependencies & start application

```
cd frontend
yarn install
yarn dev
```

Application will be serving on http://localhost:3000
