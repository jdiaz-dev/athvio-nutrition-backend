import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { GetCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/update-calory.dto';
import { Calory, CaloryDocument } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class CaloriesPersistenceService extends MongodbQueryBuilder<CaloryDocument> {
  constructor(
    @InjectModel(Calory.name) protected readonly caloryModel: Model<CaloryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(caloryModel, logger, Calory.name);
  }

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    const calory = await this.startQuery(this.createCalory.name).create({
      ...dto,
    });
    return calory;
  }
  async getCalory({ patient }: GetCaloryDto, selectors: Record<string, number>): Promise<Calory> {
    const caloryRes = await this.startQuery(this.getCalory.name).findOne(
      {
        patient,
        isDeleted: false,
      },
      selectors,
    );
    return caloryRes;
  }
  async updateCalory({ calory, patient, ...rest }: UpdateCaloryDto, selectors: string[]): Promise<Calory> {
    const caloryRes = await this.startQuery(this.updateCalory.name).findOneAndUpdate(
      { _id: calory, patient, isDeleted: false },
      { ...rest },
      { projection: selectors, new: true },
    );

    return caloryRes;
  }
}
