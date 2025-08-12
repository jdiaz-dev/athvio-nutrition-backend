import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'WorkFlowStreamAudits' })
export class WorkFlowStreamAudit extends BaseSchema {
  @Prop({ type: String, required: true })
  operation!: string;

  @Prop({ type: String, required: true })
  path!: string;

  @Prop({ type: String, required: true })
  body!: string;

  @Prop({ type: String, required: false })
  response!: string;

  @Prop({ type: String, required: false })
  error!: string;
}

export type WorkFlowStreamAuditDocument = HydratedDocument<WorkFlowStreamAudit>;
export const WorkFlowStreamAuditSchema = SchemaFactory.createForClass(WorkFlowStreamAudit);
WorkFlowStreamAuditSchema.methods.toJSON = function (): Partial<WorkFlowStreamAuditDocument> {
  const { __v, createdAt, updatedAt, ...workflowStreamAudit } = this.toObject();
  return workflowStreamAudit as Partial<WorkFlowStreamAuditDocument>;
};
