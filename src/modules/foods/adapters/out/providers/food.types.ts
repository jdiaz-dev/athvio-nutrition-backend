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

export interface Measure {
  uri: string;
  label?: string;
  weight: number;
  qualified?: Qualified[];
}

export interface FoodParsed {
  food: FoodBody;
}

export interface FoodHint extends FoodParsed {
  measures: Measure[];
}

export interface FoodParsedResponse {
  text: string;
  parsed: FoodParsed[];
  hints: FoodHint[];
  _links: {
    next: {
      title: string;
      href: string;
    };
  };
}
