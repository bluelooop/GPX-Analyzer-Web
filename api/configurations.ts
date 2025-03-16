import dotenv from 'dotenv';
import path from 'path';

interface Configuration {
  filename: string;
  override: boolean;
}

const configurations: Configuration[] = [
  { filename: '.env', override: false },
  { filename: '.env.local', override: true },
];

const testConfigurations: Configuration[] = [
  { filename: '.env.test', override: true },
  { filename: '.env.test.local', override: true },
];

export const loadConfigurations = () => {
  Array.from({ ...configurations, ...testConfigurations }).forEach(({ filename, override }) => {
    dotenv.config({ path: path.resolve(process.cwd(), filename), override });
  });
};

export const loadConfigurationsForTests = (testPath: string) => {
  testConfigurations.forEach(({ filename, override }) => {
    dotenv.config({ path: path.resolve(testPath, filename), override });
  });
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PYTHON_PATH: string;
      GPX_ANALYZER_SCRIPT_PATH: string;
      // Add other env variables here
      NODE_ENV: 'development' | 'production';
    }
  }
}

// This exports the types to make the file a module
export {};
