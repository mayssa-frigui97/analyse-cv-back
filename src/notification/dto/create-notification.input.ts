import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateDateColumn } from 'typeorm';

@InputType()
export class CreateNotificationInput {
  //   @CreateDateColumn()
  //   @IsNotEmpty()
  //   @Field()
  //   date: Date;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsBoolean()
  @Field({ defaultValue: false, nullable: true })
  lu?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Field((type) => Int)
  collaborateurId?: number;
}
