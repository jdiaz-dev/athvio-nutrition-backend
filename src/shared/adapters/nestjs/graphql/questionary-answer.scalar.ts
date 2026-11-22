import { GraphQLError, GraphQLScalarType, Kind, ValueNode } from 'graphql';

export type PrimitiveAnswer = string | number | boolean;

export type FocusedQuestionAnswer = {
  professionalFocusedQuestion: string; // uuid of the FocusedQuestion in the professional questionary
  answer?: PrimitiveAnswer;
};

export type MultipleSelectorAnswerItem = {
  name: string;
  focusedQuestions?: FocusedQuestionAnswer[];
};

export type QuestionaryAnswer = PrimitiveAnswer | MultipleSelectorAnswerItem[];

const isPrimitive = (value: unknown): value is PrimitiveAnswer =>
  typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value));

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const invalid = (reason: string): never => {
  throw new GraphQLError(`QuestionaryAnswer: ${reason}`);
};

const parseFocusedQuestionAnswer = (value: unknown): FocusedQuestionAnswer => {
  if (!isPlainObject(value)) invalid('focusedQuestions items must be objects');
  const { professionalFocusedQuestion, answer } = value as Record<string, unknown>;
  if (typeof professionalFocusedQuestion !== 'string' || !professionalFocusedQuestion) {
    invalid('focusedQuestions[].professionalFocusedQuestion must be a string');
  }
  if (answer === undefined || answer === null) return { professionalFocusedQuestion: professionalFocusedQuestion as string };
  if (!isPrimitive(answer)) invalid('focusedQuestions[].answer must be a string, number or boolean');
  return { professionalFocusedQuestion: professionalFocusedQuestion as string, answer: answer as PrimitiveAnswer };
};

const parseMultipleSelectorItem = (value: unknown): MultipleSelectorAnswerItem => {
  if (!isPlainObject(value)) invalid('array items must be objects with a name');
  const { name, focusedQuestions } = value as Record<string, unknown>;
  if (typeof name !== 'string' || !name) invalid('array items must have a string name');
  if (focusedQuestions !== undefined && focusedQuestions !== null && !Array.isArray(focusedQuestions)) {
    invalid('focusedQuestions must be an array');
  }
  return {
    name: name as string,
    ...(Array.isArray(focusedQuestions) && { focusedQuestions: focusedQuestions.map(parseFocusedQuestionAnswer) }),
  };
};

export const parseQuestionaryAnswer = (value: unknown): QuestionaryAnswer | null => {
  if (value === null || value === undefined) return null;
  if (isPrimitive(value)) return value;
  if (Array.isArray(value)) return value.map(parseMultipleSelectorItem);
  return invalid('must be a string, number, boolean or an array of { name, focusedQuestions }');
};

const astToValue = (ast: ValueNode): unknown => {
  switch (ast.kind) {
    case Kind.STRING:
      return ast.value;
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.NULL:
      return null;
    case Kind.LIST:
      return ast.values.map(astToValue);
    case Kind.OBJECT:
      return Object.fromEntries(ast.fields.map((field) => [field.name.value, astToValue(field.value)]));
    default:
      return invalid('variables are not supported inside literal answers');
  }
};

export const QuestionaryAnswerScalar = new GraphQLScalarType({
  name: 'QuestionaryAnswer',
  description:
    'Answer of a questionary detail: string | number | boolean | [{ name: String, focusedQuestions?: [{ professionalFocusedQuestion: String, answer?: String | Number | Boolean }] }]. When read, focusedQuestions items also include fieldName and associatedQuestion from the professional questionary',
  serialize: (value: unknown) => (value === undefined ? null : value),
  parseValue: parseQuestionaryAnswer,
  parseLiteral: (ast) => parseQuestionaryAnswer(astToValue(ast)),
});
