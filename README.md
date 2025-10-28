This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the install:

```bash
pnpm install
```

## Adding the env credentials

Create a `.env` file in the root directory with the following variables:

```bash
DATABASE_URL=your-neon-db-url
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
RESEND_API_KEY=your-resend-api-key
```

## Running the Better auth cli to get our schema for drizzle

It will generate a auth-schema.ts that we need to copy to the drizzle schema

```bash
    npx @better-auth/cli generate
```

We need to copy the content of the auth-schema to the drizzle schema in the db folder.

## Pushing the schema to the Neon db

first we need to generate the schema

```bash
    npx db:generate
```

after that we need to push it to our Neon db

```bash
    npx db:push
```

## Starting the application

Now if we have done everything correct we can visit it on localhost:3000

```bash
pnpm run dev
```