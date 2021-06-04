import { Scalar, CustomScalar } from '@nestjs/graphql';
// FileUpload is just an interface, not really useful in any way here, just to be 
// explicit of what type comes out whenever I want to check out the scalar
import { FileUpload } from 'graphql-upload';

@Scalar('Upload')
export class Upload implements CustomScalar<object, any> {
  description = 'Upload custom scalar type';


// the value arrives here already parsed
  parseValue(value: FileUpload) {
    return value;
  }


  // You dont use this
  serialize(value: any) {
    return null;
  }

  // You dont use this
  parseLiteral(ast) {
    return null;
  }
}