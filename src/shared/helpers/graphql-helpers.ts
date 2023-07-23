import { FieldNode, GraphQLResolveInfo } from 'graphql';
import { Pagination } from 'src/shared/enums/project';

function extractor(value: GraphQLResolveInfo): string[] {
  const rawSelections = value.fieldNodes[0].selectionSet.selections as FieldNode[];
  function extractorHelper(node: FieldNode[]): string[] {
    if (!node) return null;

    return node
      .map((item) => {
        if (item.selectionSet) {
          return extractorHelper(item.selectionSet.selections as FieldNode[]).reduce((acc: string[], elem: string) => {
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

function extractorForAggregation(value: GraphQLResolveInfo): Record<string, number> {
  const res = extractor(value).reduce((acc: Record<string, number>, item) => {
    acc[item] = 1;
    return acc;
  }, {});
  // console.log('------res', res);
  return res;
}

export function selectorExtractor(): { transform: (value: GraphQLResolveInfo) => string[] }[] {
  return [
    {
      transform: extractor,
    },
  ];
}

export function selectorExtractorForAggregation(): { transform: (value: GraphQLResolveInfo) => Record<string, number> }[] {
  return [
    {
      transform: extractorForAggregation,
    },
  ];
}

export const removeAttributesWithFieldNames = (
  selectors: Record<string, number>,
  fieldNames: string[],
): Record<string, number> => {
  const _selectors = { ...selectors };
  for (const x in _selectors) {
    for (const y of fieldNames) {
      if (x.includes(y)) {
        delete _selectors[x];
      }
    }
  }
  return _selectors;
};
