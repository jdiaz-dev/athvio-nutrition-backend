const restrictionPrompt = 'Void processed foods and supplements. ';
const betterCasePrompt = "Use only organic foods but you void use 'organic' word in the response. ";
const undesiredCookingMethodPrompt = 'Void to add grilled foods. ';

export const basicNutritionPrompt = (stringDiseases: string, days: number = 2, meals: number = 2) => {
  const planPeriodPrompt = `Build a nutritional plan to heal ${stringDiseases}, must be for ${days} days, every day must have ${meals} meals and 3 ingredients in every meal. `;
  return planPeriodPrompt + restrictionPrompt + betterCasePrompt + undesiredCookingMethodPrompt;
};

export const nutritionalPlanPrompt = (stringCauseDiseases: string, nutritionalPreferences: string) => {
  return `The diseases was caused by ${stringCauseDiseases}, must include these nutritional preferences: ${nutritionalPreferences}`;
};
