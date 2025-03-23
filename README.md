This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

I built this project prompting and instructing AI to generate the code for me. I used Claude Sonnet 3.7, 
Cursor, DeepSeek and GitHub Copilot.

![ModelArena](/ModelArena_logo.png)

### Why ModelArena?

AI Response Evaluation Platform

ModelArena is an open-source tool designed to systematically evaluate the quality of AI model responses. Users can input a prompt and its corresponding AI-generated response, then grade it against customizable criteria such as bias, reasoning accuracy, response structure, hallucinations, and more. The platform supports multi-model comparison, enabling users to benchmark responses against different LLMs (e.g., GPT-4, Claude, Gemini, DeepSeek an others) to identify strengths and weaknesses.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Main Functionality

This project is a LLM Response evaluation tool that allows users to evaluate responses using an AI model or manually. Users can input prompts and their response and do evaluations based on predefined criterias.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
