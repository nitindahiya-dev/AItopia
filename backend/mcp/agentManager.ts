import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class AgentManager {
  agents: any[];
  constructor() {
    this.agents = [];
  }

  registerAgent(agent: any) {
    this.agents.push(agent);
  }

  getAgents() {
    return this.agents;
  }

  async generateText({
    inputText,
    tone,
    creativity,
  }: {
    inputText: string;
    tone: string;
    creativity: number;
  }): Promise<string> {
    let temperature = 0.7;
    if (tone === 'professional') {
      temperature = 0.6;
    } else if (tone === 'casual') {
      temperature = 0.8;
    } else if (tone === 'creative') {
      temperature = 0.9;
    }
    temperature = temperature * (creativity / 75);
    const model = "gpt2";
    const data = {
      inputs: inputText,
      parameters: {
        max_new_tokens: 100,
        temperature,
      },
    };

    const hfResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      data,
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );
    const outputText = hfResponse.data && hfResponse.data.length > 0 && hfResponse.data[0].generated_text;
    if (!outputText) {
      throw new Error('No text generated');
    }
    return outputText;
  }
}

export default new AgentManager();