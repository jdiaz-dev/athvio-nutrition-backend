import OpenAI from 'openai';

export class GptService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.GPT_SECRET_KEY, //this.configService.get<string>('gptProvider.gptSecretKey'),
    });
  }

  async streamResponse() {
    const stream = this.openai.responses.stream({
      model: 'gpt-5',
      reasoning: { effort: 'low' },
      input: [
        {
          role: 'user',
          content: 'Are semicolons optional in JavaScript?',
        },
      ],
    });

    // Process stream events...
    for await (const event of stream) {
      // Handle events
      event;
    }

    const finalResponse = await stream.finalResponse();
    console.log(finalResponse);
    console.log(finalResponse.output_text); // undefined
    console.log((finalResponse.output[1] as any).content); // undefined
  }
  async createResponse() {
    const response = await this.openai.responses.create({
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: 'Are semicolons optional in JavaScript?',
        },
      ],
    });
    console.log(response);
    console.log(response.output_text);
  }
}

const gptService = new GptService();
gptService.streamResponse();
// gptService.createResponse();

