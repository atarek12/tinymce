import { AlloySpec, ItemTypes, Menu as AlloyMenu, RawDomSchema, SimpleSpec } from '@ephox/alloy';
import { Arr, Fun, Obj } from '@ephox/katamari';

interface StructureSpec extends SimpleSpec {
  readonly dom: RawDomSchema;
  readonly components: AlloySpec[];
}

const chunk = <I>(rowDom: RawDomSchema, numColumns: number) => (items: I[]): Array<{ dom: RawDomSchema; components: I[] }> => {
  const chunks = Arr.chunk(items, numColumns);
  return Arr.map(chunks, (c) => ({
    dom: rowDom,
    components: c
  }));
};

const forSwatch = (columns: number | 'auto'): StructureSpec => ({
  dom: {
    tag: 'div',
    classes: [ 'tox-menu', 'tox-swatches-menu' ]
  },
  components: [
    {
      dom: {
        tag: 'div',
        classes: [ 'tox-swatches' ]
      },
      components: [
        AlloyMenu.parts.items({
          preprocess: columns !== 'auto' ? chunk(
            {
              tag: 'div',
              classes: [ 'tox-swatches__row' ]
            },
            columns
          ) : Fun.identity
        })
      ]
    }
  ]
});

const forToolbar = (columns: number): StructureSpec => ({
  dom: {
    tag: 'div',
    // TODO: Configurable lg setting?
    classes: [ 'tox-menu', 'tox-collection', 'tox-collection--toolbar', 'tox-collection--toolbar-lg' ]
  },
  components: [
    AlloyMenu.parts.items({
      preprocess: chunk(
        {
          tag: 'div',
          classes: [ 'tox-collection__group' ]
        },
        columns
      )
    })
  ]
});

// NOTE: That type signature isn't quite true.
const preprocessCollection = (items: ItemTypes.ItemSpec[], isSeparator: (a: ItemTypes.ItemSpec, index: number) => boolean): AlloySpec[] => {
  const allSplits: ItemTypes.ItemSpec[][] = [ ];
  let currentSplit: ItemTypes.ItemSpec[] = [ ];
  Arr.each(items, (item, i) => {
    if (isSeparator(item, i)) {
      if (currentSplit.length > 0) {
        allSplits.push(currentSplit);
      }
      currentSplit = [ ];
      if (Obj.has(item.dom, 'innerHtml') || item.components && item.components.length > 0) {
        currentSplit.push(item);
      }
    } else {
      currentSplit.push(item);
    }
  });

  if (currentSplit.length > 0) {
    allSplits.push(currentSplit);
  }

  return Arr.map(allSplits, (s) => ({
    dom: {
      tag: 'div',
      classes: [ 'tox-collection__group' ]
    },
    components: s
  }));
};

const forCollection = (columns: number | 'auto', initItems: ItemTypes.ItemSpec[], _hasIcons: boolean = true): StructureSpec => ({
  dom: {
    tag: 'div',
    classes: [ 'tox-menu', 'tox-collection' ].concat(columns === 1 ? [ 'tox-collection--list' ] : [ 'tox-collection--grid' ])
  },
  components: [
    // TODO: Clean up code and test atomically
    AlloyMenu.parts.items({
      preprocess: (items: ItemTypes.ItemSpec[]) => {
        if (columns !== 'auto' && columns > 1) {
          return chunk<AlloySpec>({
            tag: 'div',
            classes: [ 'tox-collection__group' ]
          }, columns)(items);
        } else {
          return preprocessCollection(items, (_item, i) => initItems[i].type === 'separator');
        }
      }
    })
  ]
});

const forHorizontalCollection = (initItems: ItemTypes.ItemSpec[], _hasIcons: boolean = true): StructureSpec => ({
  dom: {
    tag: 'div',
    classes: [ 'tox-collection', 'tox-collection--horizontal' ]
  },
  components: [
    AlloyMenu.parts.items({
      preprocess: (items: ItemTypes.ItemSpec[]) => preprocessCollection(items, (_item, i) => initItems[i].type === 'separator')
    })
  ]
});

export {
  chunk,
  forSwatch,
  forCollection,
  forHorizontalCollection,
  forToolbar
};
