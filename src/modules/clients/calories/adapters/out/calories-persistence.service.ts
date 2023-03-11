import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/create-calory.dto';
import { GetCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/update-calory.dto';
import { Calory, CaloryDocument } from 'src/modules/clients/calories/adapters/out/calory.schema';
import { ErrorCaloryEnum, ErrorClientsEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class CaloriesPersistenceService {
  constructor(@InjectModel(Calory.name) private readonly caloryModel: Model<CaloryDocument>) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    const calory = await this.caloryModel.create({
      ...dto,
    });
    return calory;
  }
  async getCalory({ caloryId, clientId }: GetCaloryDto, selectors: string[]): Promise<Calory> {
    const calory = await this.caloryModel.findOne(
      {
        _id: caloryId,
        clientId,
        isDeleted: false,
      },
      selectors,
    );
    if (!calory) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return calory;
  }
  async updateCalory({ caloryId, clientId, ...rest }: UpdateCaloryDto, selectors: string[]): Promise<Calory> {
    const calory = await this.caloryModel.findOneAndUpdate(
      { _id: caloryId, clientId, isDeleted: false },
      { ...rest },
      { projection: selectors, new: true },
    );

    if (calory == null) throw new BadRequestException(ErrorCaloryEnum.CALORY_NOT_FOUND);
    return calory;
  }
}
