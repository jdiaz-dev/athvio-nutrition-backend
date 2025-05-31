import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { GetCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/update-calory.dto';
import { Calory, CaloryDocument } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { BaseRepository } from 'src/shared/database/base-repository';

@Injectable()
export class CaloriesPersistenceService extends BaseRepository<CaloryDocument> {
  constructor(
    @InjectModel(Calory.name) protected readonly caloryModel: Model<CaloryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(caloryModel, logger, Calory.name);
  }

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    const calory = await this.create({
      ...dto,
    });
    return calory;
  }
  async getCalory({ patient }: GetCaloryDto, selectors: Record<string, number>): Promise<Calory> {
    const caloryRes = await this.findOne(
      {
        patient,
        isDeleted: false,
      },
      selectors,
    );
    return caloryRes;
  }
  async updateCalory({ calory, patient, ...rest }: UpdateCaloryDto, selectors: string[]): Promise<Calory> {
    const caloryRes = await this.findOneAndUpdate(
      { _id: calory, patient, isDeleted: false },
      { ...rest },
      { projection: selectors, new: true },
    );

    return caloryRes;
  }
}
