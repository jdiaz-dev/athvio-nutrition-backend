//--------- version required of extractor to make super dynamic quieres to mongodb
/* function extractor(value: any) {
  const rawSelections = value.fieldNodes[0].selectionSet.selections as any[];
  //   console.log('----rawSelections1', rawSelections);
  //   console.log('----rawSelections2', rawSelections[2].selectionSet.selections);
  const endSelections = rawSelections.reduce((acum, item) => {
    if (item.selectionSet) {
      acum.push({
        [item.name.value]: item.selectionSet.selections.map((x: any) => x.name.value),
      });
    } else {
      acum.push(item.name.value);
    }
    return acum;
  }, []);
  console.log('----endSelections', endSelections);
  return endSelections;
}
 */

function extractor(value: any): string[] {
  const rawSelections = value.fieldNodes[0].selectionSet.selections as any[];
  //   console.log('----rawSelections1', rawSelections);
  //   console.log('----rawSelections2', rawSelections[2].selectionSet.selections);
  const endSelections = rawSelections.map((item) => item.name.value);
  return endSelections;
}

export function selectorExtractor() {
  return [
    {
      transform: extractor,
    },
  ];
}
/* export const objectSelector = (selectors: any[]) => {
  const res = selectors.reduce((acum, item) => {
    if (typeof item === 'string') {
      acum[item] = 1;
    } else {
      //nesting object between the acumulator
      let key = Object.keys(item)[0];
      acum[key] = {};
      const subItems = item[key];
      for (let x of subItems) {
        console.log('--------x', key);
        acum[key][x] = `$${x}`;
      }
    }
    return acum;
  }, {});

  console.log('--------res selectors', res);
  return res;
}; */
