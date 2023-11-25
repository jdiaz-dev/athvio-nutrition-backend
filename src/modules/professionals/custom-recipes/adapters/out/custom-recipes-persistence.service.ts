import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CustomRecipe, CustomRecipeDocument } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipe.schema';
import {
  GetCustomRecipesDto,
  GetCustomRecipesResponse,
} from 'src/modules/professionals/custom-recipes/adapters/in/dtos/get-custom-recipes.dto';
import { DeleteCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/delete-custom-recipe.dto';
import { ErrorCustomRecipeEnum } from 'src/shared/enums/messages-response';
import { CreateCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/create-custom-recipe.dto';
import { GetCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/get-custom-recipe.dto';
import { UpdateCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/update-custom-recipe.dto';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class CustomRecipesPersistenceService {
  constructor(@InjectModel(CustomRecipe.name) private readonly customRecipeModel: Model<CustomRecipeDocument>) {}

  async createCustomRecipe({ professional, ...rest }: CreateCustomRecipeDto): Promise<CustomRecipe> {
    const customRecipe = await this.customRecipeModel.create({
      professional,
      ...rest,
    });
    return customRecipe;
  }

  async getCustomRecipe({ professional, ...rest }: GetCustomRecipeDto, selectors: string[]): Promise<CustomRecipe> {
    const customRecipeRes = await this.customRecipeModel.findOne(
      {
        _id: rest.customRecipe,
        professional,
        isDeleted: false,
      },
      selectors,
    );
    if (customRecipeRes === null) throw new BadRequestException(ErrorCustomRecipeEnum.CUSTOM_RECIPE_NOT_FOUND);

    return customRecipeRes;
  }
  async getCustomRecipes(
    { professional, ...rest }: GetCustomRecipesDto,
    selectors: Record<string, number>,
  ): Promise<GetCustomRecipesResponse> {
    const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

    const customRecipes = await this.customRecipeModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professional),
          isDeleted: false,
        },
      },
      {
        $match: {
          $or: fieldsToSearch,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: rest.offset,
            },
            {
              $limit: rest.limit,
            },
            {
              $project: selectors,
            },
          ],
          meta: [{ $count: 'total' }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ['$meta.total', 0] },
        },
      },
    ]);

    const res: GetCustomRecipesResponse = {
      data: customRecipes[0].data,
      meta: {
        total: customRecipes[0].total ? customRecipes[0].total : 0,
        limit: rest.limit,
        offset: rest.offset,
      },
    };

    return res;
  }
  async updateCustomRecipe({ professional, customRecipe, ...rest }: UpdateCustomRecipeDto): Promise<CustomRecipe> {
    const customRecipeRes = await this.customRecipeModel.findOneAndUpdate(
      { _id: customRecipe, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (customRecipeRes === null) throw new BadRequestException(ErrorCustomRecipeEnum.CUSTOM_RECIPE_NOT_FOUND);
    return customRecipeRes;
  }

  async deleteCustomRecipe({ professional, ...rest }: DeleteCustomRecipeDto): Promise<CustomRecipe> {
    const customRecipeRes = await this.customRecipeModel.findOneAndUpdate(
      {
        _id: rest.customRecipe,
        professional: professional,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (customRecipeRes === null) throw new BadRequestException(ErrorCustomRecipeEnum.CUSTOM_RECIPE_NOT_FOUND);

    return customRecipeRes;
  }
}
