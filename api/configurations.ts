import dotenv from 'dotenv';
import path from 'path';

export const loadConfigurations = () => {
  dotenv.config();
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

  dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true });
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test.local'), override: true });
};

export const loadConfigurationsForTests = (testPath: string) => {
  dotenv.config({ path: path.resolve(testPath, '.env.test'), override: true });
  dotenv.config({ path: path.resolve(testPath, '.env.test.local'), override: true });
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
