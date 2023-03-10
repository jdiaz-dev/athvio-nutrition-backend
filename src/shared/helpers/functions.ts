function extractor(value: any) {
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


export function selectorExtractor() {
  return [
    {
      transform: extractor,
    },
  ];
}
