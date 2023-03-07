import globalConfiguration from './core/configuration';

export default async () => {
  const environmentVariables = await globalConfiguration(process.env.NODE_ENV);
  console.log('---------------environment Variables', environmentVariables);

  return {
    ...environmentVariables,
  };
};
