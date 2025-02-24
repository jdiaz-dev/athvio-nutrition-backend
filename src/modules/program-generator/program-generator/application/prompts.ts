const restrictionPrompt = 'Void processed foods and supplements.';
const betterCasePrompt = "Use only organic foods but you void use 'organic' word in the response.";
const undesiredCookingMethodPrompt = 'Void to add grilled foods.';
('The plan must be for 4 weeks with 2 meals by day and 2 foods in every meal. Every food must have at least 1 equivalent food');
const formatPrompt =
  'Deliver the result only in json format. The plan must to contain only the next JSON for an object structure:';

const energeticPrompt = 'The plan must contain high protein foods.';

export const basicNutritionPrompt = (weeks: number = 2, meals: number = 2) => {
  const planPeriodPrompt = `The plan must be for ${weeks} weeks with ${meals} meals by day and 2 foods in every meal. Every food must have at least 1 equivalent food`;
  return restrictionPrompt + betterCasePrompt + undesiredCookingMethodPrompt + planPeriodPrompt + energeticPrompt + formatPrompt;
};

export const nutritionalPlanPrompt = (stringDiseases: string, stringCauseDiseases: string, nutritionalPreferences: string) => {
  return `create a nutritional plan to heal : ${stringDiseases}  caused by ${stringCauseDiseases} include these preferences nutritionales: ${nutritionalPreferences}`;
};
export const detailJsonPrompt = 'day must be a number';

export const planJsonStructurePrompt = `
    {
      nutritionalDayPlans: { 
            day,
            meals:[
              { 
                name, 
                cookingInstructions, 
                ingredientDetails:[ 
                  { 
                    ingredient:{
                      name,
                      macros: {
                        weightInGrams,
                        protein,
                        carbs,
                        fat
                      }
                    },  
                    equivalents:[
                      {
                        name,
                        macros: {
                          weightInGrams,
                          protein,
                          carbs,
                          fat
                        }
                      }
                    ], 
                     
                  } 
                ], 
                macros: {
                  protein,
                  carbs,
                  fat
                } 
              }
            ] 
        }
    }
    `;
