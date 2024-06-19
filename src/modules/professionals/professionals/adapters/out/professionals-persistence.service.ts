import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { Professional, ProfessionalDocument } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional } from 'src/modules/professionals/professionals/adapters/out/professional.types';

@Injectable()
export class ProfessionalsPersistenceService {
  constructor(@InjectModel(Professional.name) private professionalModel: Model<ProfessionalDocument>) {}

  async createProfessional(dto: CreateProfessional): Promise<Professional> {
    return await this.professionalModel.create(dto);
  }
  async getProfessionalById(professional: string): Promise<Professional> {
    try {
      const professionalRes = await this.professionalModel.findOne({ _id: professional, isActive: true }).select('_id firstname');

      return professionalRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  updateTemplateMode() {}
}
