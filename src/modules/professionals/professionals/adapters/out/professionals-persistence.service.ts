import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfessionalMessages } from 'src/shared/enums/messages-response';
import { Professional, ProfessionalDocument } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional } from 'src/modules/professionals/professionals/adapters/out/professional.types';

@Injectable()
export class ProfessionalsPersistenceService {
  constructor(@InjectModel(Professional.name) private professionalModel: Model<ProfessionalDocument>) {}

  async createProfessional(dto: CreateProfessional): Promise<Professional> {
    return await this.professionalModel.create(dto);
  }
  async getProfessionalById(professionalId: string): Promise<Professional> {
    const professional = await this.professionalModel.findOne({ _id: professionalId, isActive: true }).select('_id firstname');

    if (!professional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND);
    return professional;
  }
  updateTemplateMode() {}
}
