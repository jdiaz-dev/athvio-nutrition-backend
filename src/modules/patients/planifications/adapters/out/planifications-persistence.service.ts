import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/create-planification.dto';
import { GetPlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-calory.dto';
import { updatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/update-calory.dto';
import { Planification, PlanificationDocument } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class PlanificationsPersistenceService extends MongodbQueryBuilder<PlanificationDocument> {
  constructor(
    @InjectModel(Planification.name) protected readonly caloryModel: Model<PlanificationDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(caloryModel, logger, Planification.name);
  }

  async createPlanification(dto: CreatePlanificationDto): Promise<Planification> {
    const planificationRes = await this.initializeQuery(this.createPlanification.name).create({
      ...dto,
    });
    return planificationRes;
  }
  async getPlanification({ patient }: GetPlanificationDto, selectors: Record<string, number>): Promise<Planification> {
    const planificationRes = await this.initializeQuery(this.getPlanification.name).findOne(
      {
        patient,
        isDeleted: false,
      },
      selectors,
    );
    return planificationRes;
  }
  async getPlanifications({ patient }: GetPlanificationDto, selectors: Record<string, number>): Promise<Planification[]> {
    const planificationsRes = await this.initializeQuery(this.getPlanifications.name).find(
      {
        patient,
        isDeleted: false,
      },
      selectors,
    );
    return planificationsRes;
  }
  async updatePlanification({ calory, patient, ...rest }: updatePlanificationDto, selectors: string[]): Promise<Planification> {
    const planificationRes = await this.initializeQuery(this.updatePlanification.name).findOneAndUpdate(
      { uuid: calory, patient, isDeleted: false },
      { ...rest },
      { projection: selectors, new: true },
    );

    return planificationRes;
  }
}
