import { Scalar } from '@nestjs/graphql';
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Scalar('Upload')
export class UploadScalar {
  description = 'Upload files';

  parseValue(value: any) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast: any) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}
