import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/create-nutritional-meal.dto';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import {
  GetNutritionalMealsForProfessionalDto,
  GetNutritionalMealsResponse,
} from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meals-for-professional.dto';
import { NutritionalMealDatabases } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { EnumSources } from 'src/shared/enums/project';
import { GetNutritionalMealsForPatientDto } from 'src/modules/professionals/nutritional-meals/adapters/in/mobile/dtos/get-nutritional-meals-for-patient.dto';
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meal.dto';
import { ErrorNutritionalMealEnum } from 'src/shared/enums/messages-response';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/update-nutritional-meal.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/delete-nutritional-meal.dto';
import { UploadMealImageService } from 'src/modules/professionals/nutritional-meals/application/upload-meal-image.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class NutritionalMealsManagerService {
  constructor(
    @Inject(forwardRef(() => UploadMealImageService)) private readonly umis: UploadMealImageService,
    private readonly pms: ProfessionalsManagementService,
    private readonly nmps: NutritionalMealsPersistenceService,
  ) {}

  async createNutritionalMeal({ image, ...dto }: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    await this.pms.getProfessionalByUuid(dto.professional, { _id: 1 });
    const nutritionalMeal = await this.nmps.createNutritionalMeal({ uuid: randomUUID(), ...dto });
    if (image && image instanceof Promise) return await this.umis.uploadImage({ nutritionalMeal: nutritionalMeal.uuid, image });

    return nutritionalMeal;
  }
  async getNutritionalMealsForProfessional(
    { database, professional, ...rest }: GetNutritionalMealsForProfessionalDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const sourceMealsQuery =
      database === NutritionalMealDatabases.ALL
        ? {
            $or: [
              {
                $and: [{ professional: { $eq: professional } }, { source: { $eq: EnumSources.PROFESSIONAL } }],
              },
              { $and: [{ source: { $eq: EnumSources.SYSTEM }, language: { $eq: rest.language } }] },
            ],
          }
        : database === NutritionalMealDatabases.CUSTOM_MEALS
          ? { source: EnumSources.PROFESSIONAL }
          : { source: EnumSources.SYSTEM };

    const filters = {
      match: {
        ...sourceMealsQuery,
      },
      ...rest,
    };
    const nutritionalMeals = await this.nmps.getNutritionalMeals(filters, selectors);
    return nutritionalMeals;
  }
  async getNutritionalMealsForPatient(
    { patient, category, ...rest }: GetNutritionalMealsForPatientDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const nutritionalMeals = await this.nmps.getNutritionalMeals(
      { ...rest, match: { categories: { $in: [category] } } },
      selectors,
    );
    return nutritionalMeals;
  }
  async getNutritionalMeal(
    dto: Omit<GetNutritionalMealDto, 'professional'> & { professional?: string },
    selectors: Record<string, number>,
  ) {
    const nutritionalMealRes = await this.nmps.getNutritionalMeal(dto, selectors);
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_MEAL_NOT_FOUND);

    return nutritionalMealRes;
  }
  async updateNutritionalMeal({ image, ...rest }: UpdateNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nmps.updateNutritionalMeal({ ...rest, source: EnumSources.PROFESSIONAL });
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_MEAL_NOT_FOUND);
    if (image && image instanceof Promise) return await this.umis.uploadImage({ nutritionalMeal: rest.nutritionalMeal, image });

    return nutritionalMealRes;
  }
  async deleteNutritionalMeal(dto: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nmps.deleteNutritionalMeal(dto);
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_MEAL_NOT_FOUND);
    return nutritionalMealRes;
  }
}
