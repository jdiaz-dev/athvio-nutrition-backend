import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

type Ingredient = {
  name: string;
  label: string;
  amount: number;
  weightInGrams: number;
};

type Meal = {
  mealTag: string;
  ingredientDetails: (Ingredient | any)[];
};
@Injectable()
export class PatientPlansPreparatorService {
  public preparePatientPlans<T extends { day: number; meals: (Meal | any)[] }, K>(
    plans: T[],
    params: { patient: string; assignmentStartDate: Date; startingDay?: number },
    patientPlans: K[],
    formatMealIngredients?: boolean,
  ): void {
    for (const plan of plans) {
      const adjustedDay = params.startingDay ? plan.day - params.startingDay : plan.day;
      const patientPlan = {
        assignedDate: new Date(
          dayjs(params.assignmentStartDate)
            .set('date', dayjs(params.assignmentStartDate).get('date') + adjustedDay)
            .toString(),
        ),
        patient: params.patient,
        meals: formatMealIngredients ? this.formatMealIngredients(plan.meals) : plan.meals,
      };
      patientPlans.push(patientPlan as K);
    }
  }
  private formatMealIngredients(meals: Meal[]): Meal[] {
    return meals.map(({ ...meal }) => {
      const formattedIngredients = meal.ingredientDetails.map((ingredientDetail) => {
        return { ingredientType: 'UNIQUE_INGREDIENT', ...ingredientDetail };
      });
      return { ...meal, ingredientDetails: formattedIngredients };
    });
  }
}
