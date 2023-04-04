const Ingredient = {
    ingredientName!: string;
    amount!: number;
    unit!: string;
    protein!: number;
    carbs!: number;
    fat!: number;
    calories!: number;
}

const CustomRecipe = {
    _id!: string;            xxxxx
    professional!: string;   xxxxx

    tagFood : string;   //field to add
    position  // field to add

    name!: string;
    ingredients!: Ingredient[];
    cookingInstruction!: string;
    macros: Macros{} // fix it
    isDeleted!: string;
}

 //--------------------------------------------------------------------------------


const MealPlan = {
    _id!: string;

    tagFood: string;            new
    position: number;

    recipeName: string;  //rename to name  --> fix
    ingredients: Ingredient[];
    cookingInstruction: string;
    macros: Macros{} // fix it
    isDeleted: boolean;
}
const Plan = {
    _id!: string;
    title!: string;
    week!: number;
    day!: number;
    mealPlans!: MealPlan[]; //rename to recipes
    //planWorkouts: any;
    isDeleted: boolean;
}
const Program = {
  _id!: string;
  professional!: string;
  name!: string;
  description!: string;
  programTags: String[];
  plans!: Plan[];
  clients: string[];
  isDeleted!: string;
}

//--------------------------------------------------------------------------------
const ClientPlan = {
  _id!: string;
  clientId!: string;
  title!: string;
  assignedDate!: Date;
  mealPlans!: MealPlan[];
  // planWorkouts!: any[];
  comments: Comment[];
  commentResult: string;
  state: PlanState;
  isDeleted!: string;
}




