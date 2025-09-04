import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { AddPatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/patient-plan-comment/add-patient-plan-comment.dto';
import { DeletePatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/patient-plan-comment/delete-patient-plan-comment.dto';
import { UpdatePatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/patient-plan-comment/update-patient-plan-comment.dto';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';
import { Trazability } from 'src/shared/types';

@Injectable()
export class PatientPlanCommentPersistenceService extends MongodbQueryBuilder<PatientPlanDocument> {
  constructor(
    @InjectModel(PatientPlan.name) protected readonly clienPlanModel: Model<PatientPlanDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(clienPlanModel, logger, PatientPlan.name, als);
  }

  async addPatientPlanComment(
    { patientPlanId, patientId, ...rest }: AddPatientPlanCommentDto,
    selectors: string[],
  ): Promise<PatientPlan> {
    const patientPlan = await this.initializeQuery(this.addPatientPlanComment.name).findOneAndUpdate(
      { uuid: patientPlanId, patientId, isDeleted: false },
      { $push: { comments: { ...rest } } },
      { new: true, projection: selectors },
    );

    if (patientPlan == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlan;
  }

  async updatePatientPlanComment(
    { patientPlanId, patientId, commentId, message }: UpdatePatientPlanCommentDto,
    selectors: string[],
  ): Promise<PatientPlan> {
    const patientPlan = await this.initializeQuery(this.updatePatientPlanComment.name).findOneAndUpdate(
      { uuid: patientPlanId, patientId, isDeleted: false },
      { $set: { 'comments.$[el].message': message } },
      {
        arrayFilters: [{ 'el.uuid': commentId, 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );

    if (patientPlan == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlan;
  }

  async deletePatientPlanComment(
    { patientPlanId, patientId, commentId }: DeletePatientPlanCommentDto,
    selectors: string[],
  ): Promise<PatientPlan> {
    const patientPlan = await this.initializeQuery(this.deletePatientPlanComment.name).findOneAndUpdate(
      { uuid: patientPlanId, patientId, isDeleted: false },
      { $set: { 'comments.$[el].isDeleted': true } },
      {
        arrayFilters: [{ 'el._id': commentId, 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );

    if (patientPlan == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlan;
  }
}
