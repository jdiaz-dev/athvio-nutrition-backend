import { BadRequestException, Injectable } from '@nestjs/common';
import { MealImagesManagerService } from 'src/shared/application/meal-images-manager.service';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { PatientProgramMealsPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-program-meals-persistence.service';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { AddPatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/add-patient-program-meal.dto';
import { UpdatePatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/update-patient-program-meal.dto';
import { DeletePatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/delete-patient-program-meal.dto';

@Injectable()
export class PatientProgramMealsManagerService {
  constructor(
    private readonly mps: PatientProgramMealsPersistenceService,
    private readonly mims: MealImagesManagerService,
  ) {}

  async addPatientProgramMeal(
    { meals, ...restDto }: AddPatientProgramMealDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const program = await this.mps.addPatientProgramMeal({ ...restDto, meals: imageMealsProcessed }, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async updatePatientProgramMeal(
    { meals, ...rest }: UpdatePatientProgramMealDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const program = await this.mps.updatePatientProgramMeal({ ...rest, meals: imageMealsProcessed }, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async deletePatientProgramMeal(dto: DeletePatientProgramMealDto, selectors: Record<string, number>): Promise<PatientProgram> {
    const program = await this.mps.deletePatientProgramMeal(dto, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
