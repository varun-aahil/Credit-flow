export type CommandGenerator = AsyncGenerator<string, void, unknown>;

export interface CommandOptions {
  model?: string;
  maxTokens?: number;
  saveTo?: string; // Path to save output to in addition to stdout
  hint?: string; // Additional context or hint for the AI
  url?: string; // URL for browser commands
  debug?: boolean; // Enable debug output
}

export interface Command {
  execute(query: string, options?: CommandOptions): CommandGenerator;
}

export interface CommandMap {
  [key: string]: Command;
}

export interface Config {
  perplexity: {
    model: string;
    apiKey?: string;
    maxTokens?: number;
  };
  gemini: {
    model: string;
    apiKey?: string;
    maxTokens?: number;
  };
  doc?: {
    maxRepoSizeMB?: number; // Maximum repository size in MB for remote processing
  };
}
