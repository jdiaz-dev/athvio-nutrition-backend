import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Scalar('Upload')
export class UploadScalar implements CustomScalar<string | any, string | any> {
  parseValue(value: any): string | any {
    if (typeof value === 'string') {
      return value;
    }
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any): string {
    // Convert to string for response
    return typeof value === 'string' ? value : value.filename;
  }

  parseLiteral(ast: ValueNode): string | null {
    // Handle value from query literal
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  }
}
