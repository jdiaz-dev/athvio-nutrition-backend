/* food types */
interface FoodBody {
  foodId: string;
  label: string;
  knownAs: string;
  nutrients: {
    ENERC_KCAL: number;
    PROCNT: number;
    FAT: number;
    CHOCDF: number;
    FIBTG: number;
  };
  category: string;
  categoryLabel: string;
  image: string;
}

interface Qualifier {
  uri: string;
  label: string;
}
interface Qualified {
  qualifiers: Qualifier[];
  weight: number;
}

export interface FoodMeasure {
  uri: string;
  label?: string;
  weight: number;
  qualified?: Qualified[];
}

export interface FoodParsed {
  food: FoodBody;
}

export interface FoodHint extends FoodParsed {
  measures: FoodMeasure[];
}

export interface NextLink {
  title: string;
  href: string;
}

interface Links {
  next: NextLink;
}

export interface FoodParsedResponse {
  text?: string;
  parsed?: FoodParsed[];
  hints: FoodHint[];
  _links?: Links;
}

/* food nutrition types */
export interface NutrientInfo {
  label: string;
  quantity: number;
  unit: string;
}

export interface DailyInfo {
  label: string;
  quantity: number;
  unit: string;
}

export interface ParsedIngredient {
  quantity: number;
  measure: string;
  food: string;
  foodId: string;
  weight: number;
  retainedWeight: number;
  measureURI: string;
  status: string;
}

export interface Ingredient {
  parsed: ParsedIngredient[];
}

export interface FoodNutrition {
  uri: string;
  calories: number;
  totalWeight: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];

  // e.g. ENERC_KCAL, FAT, CHOCDF.net, PROCNT, etc.
  totalNutrients: Record<string, NutrientInfo>;

  // % daily values
  totalDaily: Record<string, DailyInfo>;

  ingredients: Ingredient[];
}
