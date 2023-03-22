function extractor(value: any): string[] {
  const rawSelections = value.fieldNodes[0].selectionSet.selections as any[];

  function extractorHelper(node: any[]): string[] {
    if (!node) return null;

    return node
      .map((item: any) => {
        if (item.selectionSet) {
          return extractorHelper(item.selectionSet.selections).map((elem: string) => `${item.name.value}.${elem}`);
        }
        return item.name.value;
      })
      .flat();
  }
  const res = extractorHelper(rawSelections);
  // console.log('------res', res);
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
