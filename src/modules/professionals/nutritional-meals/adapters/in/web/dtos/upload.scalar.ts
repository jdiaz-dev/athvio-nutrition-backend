import { Scalar } from '@nestjs/graphql';
import { ReadStream } from 'fs';
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';


export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}

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
