import { _FilterQuery } from 'mongoose';

type aggregationExpr = {
  $expr: {
    $regexMatch: {
      input: {
        $concat: string[];
      };
      regex: RegExp;
    };
  };
};

type uniqueFieldRegExp = { [field: string]: RegExp };
type RegExpOtions = uniqueFieldRegExp[] | aggregationExpr[];

export const searchByFieldsGenerator = (
  fields: string[],
  words: string[],
): Array<_FilterQuery<uniqueFieldRegExp | aggregationExpr>> => {
  const uniqueFields: uniqueFieldRegExp[][] = fields.map((field) =>
    words.map((word) => {
      return { [field]: new RegExp(word) };
    }),
  );

  const fieldsConcatenated = fields.reduce((acc: string[], field, index) => {
    acc.push(`$${field}`);
    if (index < fields.length - 1) acc.push(' ');
    return acc;
  }, []);

  const concatenatedFields: aggregationExpr[] = words.map((word) => {
    const aggregation: aggregationExpr = {
      $expr: {
        $regexMatch: {
          input: {
            $concat: fieldsConcatenated,
          },
          regex: new RegExp(word),
        },
      },
    };
    return aggregation;
  });

  const res = (uniqueFields as RegExpOtions[]).flat().concat(concatenatedFields);
  return res;
};
