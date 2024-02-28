import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddPatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/add-patient-plan-comment.dto';
import { DeletePatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/delete-patient-plan-comment.dto';
import { UpdatePatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/update-patient-plan-comment.dto';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientPlanCommentPersistenceService {
  constructor(@InjectModel(PatientPlan.name) private readonly clienPlanModel: Model<PatientPlanDocument>) {}

  async addPatientPlanComment(
    { patientPlanId, patientId, ...rest }: AddPatientPlanCommentDto,
    selectors: string[],
  ): Promise<PatientPlan> {
    const patientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlanId, patientId, isDeleted: false },
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
    const patientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlanId, patientId, isDeleted: false },
      { $set: { 'comments.$[el].message': message } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(commentId), 'el.isDeleted': false }],
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
    const patientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlanId, patientId, isDeleted: false },
      { $set: { 'comments.$[el].isDeleted': true } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(commentId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );

    if (patientPlan == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlan;
  }
}
