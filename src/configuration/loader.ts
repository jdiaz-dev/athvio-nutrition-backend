import { development } from './development';
import { production } from './production';

const availableEnvironments = {
  development,
  production,
} as any;

const globalConfiguration = (environment = 'production') => {
  return availableEnvironments[environment];
};

export const getConfiguration = async () => {
  const environmentVariables = await globalConfiguration(process.env.NODE_ENV);
  return {
    ...environmentVariables,
  };
};
