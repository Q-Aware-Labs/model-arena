import ResponseEvaluator from '../components/PromptEvaluator';

export default async function Home({ params }) {
  // Properly await the params promise first
  const awaitedParams = await Promise.resolve(params);
  const { locale } = awaitedParams;
  
  return (
    <main>
      <ResponseEvaluator locale={locale} />
    </main>
  );
} 