import type { ChatOpenAI } from "@langchain/openai";
import {
  OpenAIClient,
  type OpenAIClientOptions,
} from "./models/openai-client.js";

export type LLMClientOptions = OpenAIClientOptions;

export class LLMClient {
  readonly modelName: string;
  readonly options: LLMClientOptions;
  readonly client: OpenAIClient;
  readonly llm: ChatOpenAI;

  constructor(modelName: string, options: LLMClientOptions) {
    this.modelName = modelName;
    this.options = options;
    this.client = new OpenAIClient(this.modelName, this.options);
    this.llm = this.client.llm;
  }
}
