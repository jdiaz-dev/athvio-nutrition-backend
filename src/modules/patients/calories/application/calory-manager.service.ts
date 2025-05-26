import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { GetCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/update-calory.dto';
import { CaloriesPersistenceService } from 'src/modules/patients/calories/adapters/out/calories-persistence.service';
import { Calory } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ErrorCaloryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class CaloryManagerService {
  constructor(private gps: GetPatientManagerService, private caps: CaloriesPersistenceService) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    await this.gps.getPatientById(dto.patient);
    const calory = await this.caps.createCalory(dto);
    return calory;
  }
  async getCalory(dto: GetCaloryDto, selectors: string[]): Promise<Calory> {
    const caloryRes = await this.caps.getCalory(dto, selectors);
    if (!caloryRes) throw new BadRequestException(ErrorCaloryEnum.CALORY_NOT_FOUND);

    return caloryRes;
  }
  async updateCalory(dto: UpdateCaloryDto, selectors: string[]): Promise<Calory> {
    const caloryRes = await this.caps.updateCalory(dto, selectors);
    if (caloryRes == null) throw new BadRequestException(ErrorCaloryEnum.CALORY_NOT_FOUND);
    return caloryRes;
  }
}
