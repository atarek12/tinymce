import { ItemTypes, MenuTypes } from '@ephox/alloy';
import { StructureSchema } from '@ephox/boulder';
import { InlineContent, Menu, Toolbar } from '@ephox/bridge';
import { Arr, Optional } from '@ephox/katamari';

import { components as menuComponents, dom as menuDom } from './MenuParts';
import { forCollection, forHorizontalCollection, forSwatch, forToolbar } from './MenuStructures';
import { SingleMenuItemSpec } from './SingleMenuTypes';

export interface PartialMenuSpec {
  readonly value: string;
  readonly dom: MenuTypes.MenuSpec['dom'];
  readonly components: MenuTypes.MenuSpec['components'];
  readonly items: MenuTypes.MenuSpec['items'];
}

export const menuHasIcons = (xs: Array<SingleMenuItemSpec | Menu.CardMenuItemSpec | InlineContent.AutocompleterItemSpec>): boolean =>
  Arr.exists(xs, (item) => 'icon' in item && item.icon !== undefined);

export const handleError = (error: StructureSchema.SchemaError<any>): Optional<ItemTypes.ItemSpec> => {
  // eslint-disable-next-line no-console
  console.error(StructureSchema.formatError(error));
  // eslint-disable-next-line no-console
  console.log(error);
  return Optional.none();
};

export const createHorizontalPartialMenuWithAlloyItems = (value: string, _hasIcons: boolean, items: ItemTypes.ItemSpec[], _columns: Toolbar.ColumnTypes, _presets: Toolbar.PresetTypes): PartialMenuSpec => {
  const structure = forHorizontalCollection(items);
  return {
    value,
    dom: structure.dom,
    components: structure.components,
    items
  };
};

// TODO: Potentially make this private again.
export const createPartialMenuWithAlloyItems = (value: string, hasIcons: boolean, items: ItemTypes.ItemSpec[], columns: Toolbar.ColumnTypes, presets: Toolbar.PresetTypes): PartialMenuSpec => {
  if (presets === 'color') {
    const structure = forSwatch(columns);
    return {
      value,
      dom: structure.dom,
      components: structure.components,
      items
    };
  }

  if (presets === 'normal' && columns === 'auto') {
    const structure = forCollection(columns, items);
    return {
      value,
      dom: structure.dom,
      components: structure.components,
      items
    };
  }

  if (presets === 'normal' && columns === 1) {
    const structure = forCollection(1, items);
    return {
      value,
      dom: structure.dom,
      components: structure.components,
      items
    };
  }

  if (presets === 'normal') {
    const structure = forCollection(columns, items);
    return {
      value,
      dom: structure.dom,
      components: structure.components,
      items
    };
  }

  if (presets === 'listpreview' && columns !== 'auto') {
    const structure = forToolbar(columns);
    return {
      value,
      dom: structure.dom,
      components: structure.components,
      items
    };
  }

  return {
    value,
    dom: menuDom(hasIcons, columns, presets),
    components: menuComponents,
    items
  };
};
