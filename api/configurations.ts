import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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

const prodConfigurations: Configuration[] = [
  { filename: '.env.production', override: true },
  { filename: '.env.production.local', override: true },
];

export const loadConfigurations = () => {
  console.log('Loading configurations...');
  Array.from([...configurations, ...testConfigurations, ...prodConfigurations])
    .filter(({ filename }) => fs.existsSync(path.resolve(process.cwd(), filename)))
    .forEach(({ filename, override }) => {
      console.log(`Loading configuration file: ${filename}`);
      dotenv.config({ path: path.resolve(process.cwd(), filename), override });
    });
};

export const loadConfigurationsForTests = (testPath: string) => {
  console.log('Loading configurations...');
  testConfigurations
    .filter(({ filename }) => fs.existsSync(path.resolve(testPath, filename)))
    .forEach(({ filename, override }) => {
      console.log(`Loading configuration file: ${filename}`);
      dotenv.config({ path: path.resolve(testPath, filename), override });
    });
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PYTHON_PATH: string;
      GPX_ANALYZER_SCRIPT_PATH: string;
      STRAVA_CLIENT_ID: string;
      STRAVA_CLIENT_SECRET: string;
      STRAVA_REDIRECT_HOST: string;
      STRAVA_REDIRECT_PATH: string;
      FRONTEND_URLS: string;
      FRONTEND_CONSENT_REDIRECT_HOST: string;
      FRONTEND_CONSENT_REDIRECT_PAGE: string;
      ANTHROPIC_MODEL: string;
      // Add other env variables here
      NODE_ENV: 'development' | 'production';
    }
  }
}

// This exports the types to make the file a module
export {};
