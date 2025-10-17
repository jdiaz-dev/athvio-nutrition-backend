import { local } from './local';
import { development } from './development';
import { production } from './production';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';
import { EnumEnvironments } from 'src/shared/enums/project';

class DatabaseVariables {
  @IsString()
  MONGO_DB_CONNECTION: string;
  @IsString()
  NEO4J_DATABASE: string;
  @IsString()
  NEO4J_SCHEME: string;
  @IsString()
  NEO4J_HOST: string;
  @IsString()
  NEO4J_PORT: string;
  @IsString()
  NEO4J_USERNAME: string;
  @IsString()
  NEO4J_PASSWORD: string;
}

class AllowedOriginVariables extends DatabaseVariables {
  @IsString()
  ORIGIN_PRODUCTION_S3_WEB: string;
  @IsString()
  ORIGIN_PRODUCTION_WEB_DOMAIN: string;
  @IsString()
  ORIGIN_PRODUCTION_S3_MOBILE: string;
  @IsString()
  ORIGIN_PRODUCTION_MOBILE_DOMAIN: string;
}

class FoodProviderVariables extends AllowedOriginVariables {
  @IsString()
  EDAMAM_FOOD_PARSER_URL: string;
  @IsString()
  EDAMAM_FOOD_APP_ID: string;
  @IsString()
  EDAMAM_FOOD_KEY: string;
}

class SecurityVariables extends FoodProviderVariables {
  @IsString()
  RATE_LIMIT_TLL: string;
  @IsString()
  RATE_LIMIT_VALUE: string;
}

class OauthVariables extends SecurityVariables {
  @IsString()
  OAUTH_GOOGLE_CLIENT_ID: string;
  @IsString()
  OAUTH_GOOGLE_CLIENT_SECRET: string;
}

enum POLAR_SERVER {
  PRODUCTION = 'production',
  SANDBOX = 'sandbox',
}
class PaymentProcessorVariables extends OauthVariables {
  @IsString()
  POLAR_ACCESS_TOKEN: string;
  @IsEnum(POLAR_SERVER)
  POLAR_SERVER: POLAR_SERVER;
  @IsString()
  POLAR_PRODUCT_ID: string;
}

class OtherVariables extends PaymentProcessorVariables {
  @IsEnum(EnumEnvironments)
  NODE_ENV: EnumEnvironments;
  @IsString()
  PORT: string;
  @IsString()
  STORAGE_URL: string;
  @IsString()
  SIGN_TOKEN: string;
  @IsString()
  MAILS_SENDER: string;
  @IsString()
  GPT_SECRET_KEY: string;
}

class EnvironmentVariables extends OtherVariables {}

export function validateEnvironmentVariables(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

const availableEnvironments = {
  local,
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
