import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/create-planification.dto';
import { GetPlanificationsDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-planifications.dto';
import { UpdatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/update-planification.dto';
import { Planification, PlanificationDocument } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class PlanificationsPersistenceService extends MongodbQueryBuilder<PlanificationDocument> {
  constructor(
    @InjectModel(Planification.name) protected readonly planificationModel: Model<PlanificationDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(planificationModel, logger, Planification.name);
  }

  async createPlanification(data: { uuid: string } & CreatePlanificationDto): Promise<Planification> {
    const planificationRes = await this.initializeQuery(this.createPlanification.name).create({
      ...data,
    });
    return planificationRes;
  }
  async getPlanification({ patient }: GetPlanificationsDto, selectors: Record<string, number>): Promise<Planification> {
    const planificationRes = await this.initializeQuery(this.getPlanification.name).findOne(
      {
        patient,
        isDeleted: false,
      },
      selectors,
    );
    return planificationRes;
  }
  async getPlanifications({ patient }: GetPlanificationsDto, selectors: Record<string, number>): Promise<Planification[]> {
    const planificationsRes = await this.initializeQuery(this.getPlanifications.name).find(
      {
        patient,
        isDeleted: false,
      },
      selectors,
    );
    return planificationsRes;
  }
  async updatePlanification(
    { planification, patient, ...rest }: UpdatePlanificationDto,
    selectors: string[],
  ): Promise<Planification> {
    const planificationRes = await this.initializeQuery(this.updatePlanification.name).findOneAndUpdate(
      { uuid: planification, patient, isDeleted: false },
      { ...rest },
      { projection: selectors, new: true },
    );

    return planificationRes;
  }
}
