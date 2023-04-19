export const searchByFieldsGenerator = (fields: string[], words: string[]) => {
  const uniqueFields = fields.map((field) =>
    words.map((word) => {
      return { [field]: new RegExp(word) };
    }),
  );

  const fieldsConcatenated = fields.reduce((acc, field, index) => {
    acc.push(`$${field}`);
    if (index < fields.length - 1) acc.push(' ');
    return acc;
  }, []);

  const concatenatedFields: any[] = words.map((word) => {
    return {
      $expr: {
        $regexMatch: {
          input: {
            $concat: fieldsConcatenated,
          },
          regex: new RegExp(word),
        },
      },
    };
  });
  const res = uniqueFields.flat().concat(concatenatedFields);
  //   console.log('-------res', res);
  return res;
};
