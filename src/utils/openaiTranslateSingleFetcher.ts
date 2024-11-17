import { AzureOpenAI } from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const scope = 'https://cognitiveservices.azure.com/.default';
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const openai = new AzureOpenAI({ azureADTokenProvider });

const result = await openai.chat.completions.create({
  model: 'gpt-4-1106-preview',
  messages: [{ role: 'user', content: 'Say hello!' }],
});

console.log(result.choices[0]!.message?.content);
