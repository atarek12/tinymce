import { ApproxStructure, RealKeys } from '@ephox/agar';
import { beforeEach, describe, it } from '@ephox/bedrock-client';
import { Unicode } from '@ephox/katamari';
import { PlatformDetection } from '@ephox/sand';
import { TinyAssertions, TinyHooks, TinySelections, TinyUiActions } from '@ephox/wrap-mcagar';

import Editor from 'tinymce/core/api/Editor';
import NonbreakingPlugin from 'tinymce/plugins/nonbreaking/Plugin';
import VisualCharsPlugin from 'tinymce/plugins/visualchars/Plugin';

describe('webdriver.tinymce.plugins.nonbreaking.NonbreakingVisualCharsTypingTest', () => {
  // Note: Uses RealKeys, so needs a browser. Headless won't work.
  const hook = TinyHooks.bddSetup<Editor>({
    plugins: 'nonbreaking visualchars',
    toolbar: 'nonbreaking visualchars',
    visualchars_default_state: true,
    base_url: '/project/tinymce/js/tinymce'
  }, [ NonbreakingPlugin, VisualCharsPlugin ], true);

  const detection = PlatformDetection.detect();

  const getNbspText = (text: string) => {
    if (detection.browser.isFirefox()) {
      return Unicode.zeroWidth + text + ' ';
    } else {
      return Unicode.zeroWidth + text + Unicode.nbsp;
    }
  };

  const clickNbspToolbarButton = (editor: Editor) => TinyUiActions.clickOnToolbar(editor, 'button[aria-label="Nonbreaking space"]');

  beforeEach(() => {
    const editor = hook.editor();
    editor.setContent('');
  });

  it('TINY-3647: Click on the nbsp button then type some text, and assert content is correct', async () => {
    const editor = hook.editor();
    clickNbspToolbarButton(editor);
    await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.text('test') ]);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(Unicode.zeroWidth + 'test'))
          ]
        })
      ]
    })));
  });

  it('TINY-3647: Add text to editor, click on the nbsp button, and assert content is correct', () => {
    const editor = hook.editor();
    editor.setContent('test');
    TinySelections.setCursor(editor, [ 0, 0 ], 4);
    clickNbspToolbarButton(editor);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(Unicode.zeroWidth))
          ]
        })
      ]
    })));
  });

  it('TINY-3647: Add content to editor, click on the nbsp button then type some text, and assert content is correct', async () => {
    const editor = hook.editor();
    editor.setContent('test');
    TinySelections.setCursor(editor, [ 0, 0 ], 4);
    clickNbspToolbarButton(editor);
    await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.text('test') ]);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(Unicode.zeroWidth + 'test'))
          ]
        })
      ]
    })));
  });

  it('TINY-3647: Click on the nbsp button then type a space, and assert content is correct', async () => {
    const editor = hook.editor();
    clickNbspToolbarButton(editor);
    await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.text(' ') ]);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(getNbspText('')))
          ].concat(detection.browser.isFirefox() ? [ s.element('br', {}) ] : [])
        })
      ]
    })));
  });

  it('TINY-3647: Add text to editor, click on the nbsp button and add content plus a space, and assert content is correct', async () => {
    const editor = hook.editor();
    editor.setContent('test');
    TinySelections.setCursor(editor, [ 0, 0 ], 4);
    clickNbspToolbarButton(editor);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(Unicode.zeroWidth))
          ]
        })
      ]
    })));
    await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.text('test ') ]);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(getNbspText('test')))
          ].concat(detection.browser.isFirefox() ? [ s.element('br', {}) ] : [])
        })
      ]
    })));
  });

  it('TINY-3647: Add text to editor, click on the nbsp button and add content plus a space, repeat, and assert content is correct', async () => {
    const editor = hook.editor();
    editor.setContent('test');
    TinySelections.setCursor(editor, [ 0, 0 ], 4);
    clickNbspToolbarButton(editor);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(Unicode.zeroWidth))
          ]
        })
      ]
    })));
    await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.text('test ') ]);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(getNbspText('test')))
          ].concat(detection.browser.isFirefox() ? [ s.element('br', {}) ] : [])
        })
      ]
    })));
    await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.text('test ') ]);
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.text(str.is('test')),
            s.element('span', {
              classes: [ arr.has('mce-nbsp-wrap'), arr.has('mce-nbsp') ],
              children: [
                s.text(str.is(Unicode.nbsp))
              ]
            }),
            s.text(str.is(getNbspText('test test')))
          ].concat(detection.browser.isFirefox() ? [ s.element('br', {}) ] : [])
        })
      ]
    })));
  });
});
