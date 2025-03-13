import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { GetCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/update-calory.dto';
import { Calory, CaloryDocument } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';

@Injectable()
export class CaloriesPersistenceService {
  constructor(@InjectModel(Calory.name) private readonly caloryModel: Model<CaloryDocument>) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    try {
      const calory = await this.caloryModel.create({
        ...dto,
      });
      return calory;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getCalory({ patient }: GetCaloryDto, selectors: string[]): Promise<Calory> {
    try {
      const caloryRes = await this.caloryModel.findOne(
        {
          patient,
          isDeleted: false,
        },
        selectors,
      );
      return caloryRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updateCalory({ calory, patient, ...rest }: UpdateCaloryDto, selectors: string[]): Promise<Calory> {
    try {
      const caloryRes = await this.caloryModel.findOneAndUpdate(
        { _id: calory, patient, isDeleted: false },
        { ...rest },
        { projection: selectors, new: true },
      );

      return caloryRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
