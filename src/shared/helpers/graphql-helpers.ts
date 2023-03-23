import { Pagination } from 'src/shared/enums/project';

function extractor(value: any): string[] {
  const rawSelections = value.fieldNodes[0].selectionSet.selections as any[];

  function extractorHelper(node: any[]): string[] {
    if (!node) return null;

    return node
      .map((item: any) => {
        if (item.selectionSet) {
          /* return extractorHelper(item.selectionSet.selections).map((elem: string) => {
            console.log('-----------elem', item.name.value);

            if (item.name.value !== 'meta' && item.name.value !== 'data' ) {
              return `${item.name.value}.${elem}`;
            }
            return elem !== 'total' ? elem : '';
          }); */

          return extractorHelper(item.selectionSet.selections).reduce((acc: any[], elem: string) => {
            if (item.name.value !== Pagination.META && item.name.value !== Pagination.DATA) {
              acc.push(`${item.name.value}.${elem}`);
              return acc;
            }

            if (elem !== Pagination.TOTAL) acc.push(elem);
            return acc;
          }, []);
        }
        return item.name.value;
      })
      .flat();
  }
  const res = extractorHelper(rawSelections);
  // console.log('------res pro', res);
  return res;
}

function extractorForAggregation(value: any) {
  const res = extractor(value).reduce((acc: any, item) => {
    acc[item] = 1;
    return acc;
  }, {});
  // console.log('------res', res);

  return res;
}

export function selectorExtractor() {
  return [
    {
      transform: extractor,
    },
  ];
}

export function selectorExtractorForAggregation() {
  return [
    {
      transform: extractorForAggregation,
    },
  ];
}

export const removeFieldFromAgregationSelectors = (selectors: any, fieldName: string) => {
  let _selectors = { ...selectors };
  for (let x in _selectors) {
    if (x.includes(fieldName)) {
      delete _selectors[x];
    }
  }
  return _selectors;
};

export const searchByFieldsGenerator = (fields: string[], words: (string | undefined)[]) => {
  const res = fields.map((field) =>
    words.map((word) => {
      console.log('-------------word', word)
      return { [field]: new RegExp(word) };
    }),
  );
  return res.flat();
};
