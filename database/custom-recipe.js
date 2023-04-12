const Ingredient = {
    name!: string;
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
    title!: string;  // fix : make optional
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
  programTags: ProgramTags[];
  plans!: Plan[];
  clients: Client[];
  isDeleted!: string;
}


//--------for redux
const _Program = {
  _id!: string;
  professional!: string;
  name!: string;
  description!: string;
  programTags: ProgramTags[];
  plans!: {
    byId:{
      plan1: {
        _id!: string;
        title!: string;
        week!: number;
        day!: number;
        mealPlans: [mealPlan1, mealPlan2, mealPlan3]
      },
      plan2: {
        _id!: string;
        title!: string;
        week!: number;
        day!: number;
        mealPlans: [mealPlan4, mealPlan5, mealPlan6]
      }
    },
    allIds: [plan1, plan2]
  },
  mealPlans: {

  }

  clients: Client[];
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




