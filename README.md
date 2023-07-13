## Description

Eventopia is an event-oriented website that help users discover and find exciting events in their area.
Eventopia provides a platform to discover, create events in your local community.

## Techonoly Stack

<li> Front-end: ReactJs </li>
<li> Back-end: Node.js, NestJS, Typescript </li>
<li> Database: MYSQL, Redis </li>
<li> Third-party APIs: Cloudinary, Stripe </li>

## Key Features

<li> Event Discovery: Easily browse and search event </li>
<li> Event Discovery: Easily browse and search event </li>
<li> Event Discovery: Easily browse and search event </li>

## Installation

### Backend (mysql,redis required)

```bash
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Frontend

```bash
$ npm install

# development
$ npm run dev

```

### Or with Docker

```bash
$
# Setup env file in /backend/.env

# Run containers
$ docker compose up -d --build

# insert seed data
$ docker exec -it backend npx prisma db seed
```

## API docs (Swagger)

<p>API docs available on http://localhost:3000/api</p>

## Demo

### Test payment with Stripe

Use [Test cards](https://stripe.com/docs/testing#use-test-cards) to test payment
