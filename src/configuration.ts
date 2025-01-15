import globalConfiguration from './core/configuration';

export default async () => {
  const environmentVariables = await globalConfiguration(process.env.NODE_ENV);
  return {
    ...environmentVariables,
  };
};
