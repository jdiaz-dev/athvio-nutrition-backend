import { local } from './local';
import { development } from './development';
import { production } from './production';


const availableEnvironments = {
    local,
    development,
    production,
} as any;

const globalConfiguration = (environment: string = 'production') => {
    console.log('----------environment', environment);
    return availableEnvironments[environment];
};

export default globalConfiguration;
