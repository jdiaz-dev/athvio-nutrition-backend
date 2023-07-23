import { Injectable } from '@nestjs/common';
import { ClientPlanPartial } from 'src/modules/clients/client-plans/adapters/out/client-plan.type';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { AssignProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/assign-program.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
// import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import dayjs from 'dayjs';

@Injectable()
export class AssignProgramService {
  constructor(
    private cps: ClientsPersistenceService,
    private cpps: ClientPlansPersistenceService,
    private plps: PlansPersistenceService,

  ) {
    this.cpps;
  }

  async assignProgramToClient(dto: AssignProgramDto) {
    const selectors = {
      _id: 1,
      'plans._id': 1,
      'plans.title': 1,
      'plans.week': 1,
      'plans.day': 1,
      'plans.meals._id': 1,
      'plans.meals.position': 1,
      'plans.meals.mealTag': 1,
      'plans.meals.name': 1,
      'plans.meals.ingredientDetails.ingredientType': 1,
      'plans.meals.ingredientDetails.customIngredient.amount': 1,
      'plans.meals.ingredientDetails.customIngredient.label': 1,
      'plans.meals.ingredientDetails.customIngredient.name': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.name': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.amount': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.label': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.weightInGrams': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.protein': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.carbs': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.fat': 1,
      'plans.meals.ingredientDetails.customIngredient.ingredients.calories': 1,
      'plans.meals.ingredientDetails.customIngredient.macros.weightInGrams': 1,
      'plans.meals.ingredientDetails.customIngredient.macros.protein': 1,
      'plans.meals.ingredientDetails.customIngredient.macros.carbs': 1,
      'plans.meals.ingredientDetails.customIngredient.macros.fat': 1,
      'plans.meals.ingredientDetails.customIngredient.macros.calories': 1,
      'plans.meals.ingredientDetails.ingredient.name': 1,
      'plans.meals.ingredientDetails.ingredient.amount': 1,
      'plans.meals.ingredientDetails.ingredient.label': 1,
      'plans.meals.ingredientDetails.ingredient.weightInGrams': 1,
      'plans.meals.ingredientDetails.ingredient.protein': 1,
      'plans.meals.ingredientDetails.ingredient.carbs': 1,
      'plans.meals.ingredientDetails.ingredient.fat': 1,
      'plans.meals.ingredientDetails.ingredient.calories': 1,
      'plans.meals.ingredientDetails.equivalents.ingredientType': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.amount': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.label': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.name': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.name': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.amount': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.label': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.weightInGrams': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.protein': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.carbs': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.fat': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.ingredients.calories': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.macros.weightInGrams': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.macros.protein': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.macros.carbs': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.macros.fat': 1,
      'plans.meals.ingredientDetails.equivalents.customIngredient.macros.calories': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.name': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.amount': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.label': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.weightInGrams': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.protein': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.carbs': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.fat': 1,
      'plans.meals.ingredientDetails.equivalents.ingredient.calories': 1,
      'plans.meals.cookingInstructions': 1,
      'plans.meals.macros.weightInGrams': 1,
      'plans.meals.macros.protein': 1,
      'plans.meals.macros.carbs': 1,
      'plans.meals.macros.fat': 1,
      'plans.meals.macros.calories': 1
    };
    //export type ClientPlanPartial = Pick<ClientPlan, 'client' | 'title' | 'assignedDate' | 'meals'>;
    await this.cps.getClient(dto.professional, dto.client);
    const program = await this.plps.getProgramPlanFilteredByDay({ professional: dto.professional, program: dto.program, day: dto.startingDay }, selectors);

    const clientPlans: ClientPlanPartial[] = [];
    let clientPlan: ClientPlanPartial;
    program.plans.forEach((plan, index) => {
      clientPlan = {
        assignedDate: new Date(dayjs(dto.assignmentStartDay).set('date', dayjs(dto.assignmentStartDay).get('date') + index).toString()),
        client: dto.client,
        meals: plan.meals
      };
      clientPlans.push(clientPlan);
    });

    const res = await this.cpps.createManyClientPlan(clientPlans);
    return '';
  }

}
