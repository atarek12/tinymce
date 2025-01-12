import { Arr, Obj, Type } from '@ephox/katamari';

import Editor from 'tinymce/core/api/Editor';
import { Dialog } from 'tinymce/core/api/ui/Ui';
import I18n from 'tinymce/core/api/util/I18n';

import * as Options from '../api/Options';
import * as PluginUrls from '../data/PluginUrls';

const tab = (editor: Editor): Dialog.TabSpec & { name: string } => {
  const availablePlugins = () => {
    const premiumPlugins = Arr.filter(PluginUrls.urls, ({ key, type }) => {
      return key !== 'autocorrect' && type === PluginUrls.PluginType.Premium;
    });
    const premiumPluginList = Arr.map(premiumPlugins, (plugin) => '<li>' + I18n.translate(plugin.name) + '</li>').join('');

    return '<div data-mce-tabstop="1" tabindex="-1">' +
      '<p><b>' + I18n.translate('Premium plugins:') + '</b></p>' +
      '<ul>' +
      premiumPluginList +
      '<li class="tox-help__more-link" "><a href="https://www.tiny.cloud/pricing/?utm_campaign=editor_referral&utm_medium=help_dialog&utm_source=tinymce" rel="noopener" target="_blank">' + I18n.translate('Learn more...') + '</a></li>' +
      '</ul>' +
      '</div>';
  };

  const makeLink = (p: { name: string; url: string }): string =>
    `<a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>`;

  const maybeUrlize = (editor: Editor, key: string) => Arr.find(PluginUrls.urls, (x) => {
    return x.key === key;
  }).fold(() => {
    const getMetadata = editor.plugins[key].getMetadata;
    return typeof getMetadata === 'function' ? makeLink(getMetadata()) : key;
  }, (x) => {
    const name = x.type === PluginUrls.PluginType.Premium ? `${x.name}*` : x.name;
    return makeLink({ name, url: `https://www.tiny.cloud/docs/tinymce/6/${x.slug}/` });
  });

  const getPluginKeys = (editor: Editor) => {
    const keys = Obj.keys(editor.plugins);
    const forcedPlugins = Options.getForcedPlugins(editor);

    return Type.isUndefined(forcedPlugins) ?
      keys :
      Arr.filter(keys, (k) => !Arr.contains(forcedPlugins, k));
  };

  const pluginLister = (editor: Editor) => {
    const pluginKeys = getPluginKeys(editor);
    const pluginLis = Arr.map(pluginKeys, (key) => {
      return '<li>' + maybeUrlize(editor, key) + '</li>';
    });
    const count = pluginLis.length;
    const pluginsString = pluginLis.join('');

    const html = '<p><b>' + I18n.translate([ 'Plugins installed ({0}):', count ]) + '</b></p>' +
      '<ul>' + pluginsString + '</ul>';

    return html;
  };

  const installedPlugins = (editor: Editor) => {
    if (editor == null) {
      return '';
    }
    return '<div data-mce-tabstop="1" tabindex="-1">' +
      pluginLister(editor) +
      '</div>';
  };

  const htmlPanel: Dialog.HtmlPanelSpec = {
    type: 'htmlpanel',
    presets: 'document',
    html: [
      installedPlugins(editor),
      availablePlugins()
    ].join('')
  };
  return {
    name: 'plugins',
    title: 'Plugins',
    items: [
      htmlPanel
    ]
  };
};

export {
  tab
};
