This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sample Credentials

Use these credentials to test different user portals:

```
Doctor Portal:
- Email: doctor@example.com
- Password: doc123

Patient Portal:
- Email: patient@example.com
- Password: pat123

Laboratory Portal:
- Email: lab@example.com
- Password: lab123

Pharmacy Portal:
- Email: pharmacy@example.com
- Password: pharm123
```

## Project Structure

The project uses a modular architecture with separate portals for different user types:

- `/auth/login/*` - Login pages for different user types
- `/auth/signup/*` - Registration pages for different user types
- `/dashboard/*` - Protected dashboard pages for authenticated users

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

