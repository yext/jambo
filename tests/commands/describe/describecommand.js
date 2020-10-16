const DescribeCommand = require('../../../src/commands/describe/describecommand');

const mockRepoReader = {
  getImportableThemes() {
    return ['answers-hitchhiker-theme'];
  },
  getPageTemplates() {
    return ['page1', 'page2']
  },
  getThemeFiles() {
    return [
      'themes/answers-hitchhiker-theme/test1.hbs',
      'themes/answers-hitchhiker-theme/test2.hbs',
    ];
  },
  getCards() {
    return [
      'themes/answers-hitchhiker-theme/cards/card1',
      'themes/answers-hitchhiker-theme/cards/card2'
    ];
  },
  getDirectAnswerCards() {
    return [
      'themes/answers-hitchhiker-theme/directanswercards/card1',
      'themes/answers-hitchhiker-theme/directanswercards/card2'
    ];
  }
};

const consoleSpy = jest.spyOn(console, 'dir').mockImplementation();
const mockCardCommand = {
  getAlias() {
    return 'card';
  },
  describe() {
    return {
      displayName: 'Add Card',
      params: {
        name: {
          displayName: 'Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: [
            'themes/answers-hitchhiker-theme/cards/card1',
            'themes/answers-hitchhiker-theme/cards/card2'
          ]
        }
      }
    }
  }
}
const mockDirectAnswerCardCommand = {
  getAlias() {
    return 'directanswercard';
  },
  describe() {
    return {
      displayName: 'Add Direct Answer Card',
      params: {
        name: {
          displayName: 'Direct Answer Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: [
            'themes/answers-hitchhiker-theme/directanswercards/card1',
            'themes/answers-hitchhiker-theme/directanswercards/card2'
          ]
        }
      }
    }
  }
}


describe('DescribeCommand works correctly', () => {
  new DescribeCommand(
    () => [ mockCardCommand, mockDirectAnswerCardCommand ], mockRepoReader).execute();
  const descriptions = consoleSpy.mock.calls[0][0];

  it('describes all jambo commands and nothing more', () => {
    const expectedCommandNames = [
      'init',
      'import',
      'page',
      'build',
      'override',
      'upgrade',
      'card',
      'directanswercard'
    ].sort();
    const actualCommandNames = Object.keys(descriptions).sort();
    expect(actualCommandNames).toEqual(expectedCommandNames);
  });

  it('describes init', () => {
    expect(descriptions.init).toEqual({
      displayName: 'Initialize Jambo',
      params: {
        theme: {
          displayName: 'Theme',
          type: 'singleoption',
          options: ['answers-hitchhiker-theme']
        },
        addThemeAsSubmodule: {
          displayName: 'Add Theme as Submodule',
          type: 'boolean',
          default: true
        }
      }
    });
  });

  it('describes page', () => {
    expect(descriptions.page).toEqual({
      displayName: 'Add Page',
      params: {
        name: {
          displayName: 'Page Name',
          type: 'string',
          required: true
        },
        template: {
          displayName: 'Page Template',
          type: 'singleoption',
          options: ['page1', 'page2']
        }
      }
    });
  });

  it('describes import', () => {
    expect(descriptions.import).toEqual({
      displayName: 'Import Theme',
      params: {
        theme: {
          displayName: 'Theme',
          type: 'singleoption',
          required: true,
          options: ['answers-hitchhiker-theme']
        },
        addAsSubmodule: {
          displayName: 'Add as Submodule',
          type: 'boolean',
          default: true
        }
      }
    });
  });

  it('describes override', () => {
    expect(descriptions.override).toEqual({
      displayName: 'Override Theme',
      params: {
        path: {
          displayName: 'Path to Override',
          type: 'filesystem',
          required: true,
          options: [
            'themes/answers-hitchhiker-theme/test1.hbs',
            'themes/answers-hitchhiker-theme/test2.hbs',
          ]
        }
      }
    });
  });

  it('describes upgrade', () => {
    expect(descriptions.upgrade).toEqual({
      displayName: 'Upgrade Theme',
      params: {
        isLegacy: {
          displayName: 'Is Legacy Upgrade',
          type: 'boolean'
        },
        disableScript: {
          displayName: 'Disable Upgrade Script',
          type: 'boolean'
        }
      }
    });
  });

  it('describes build', () => {
    expect(descriptions.build).toEqual({
      displayName: 'Build Pages'
    });
  });

  it('describes card', () => {
    expect(descriptions.card).toEqual({
      displayName: 'Add Card',
      params: {
        name: {
          displayName: 'Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: [
            'themes/answers-hitchhiker-theme/cards/card1',
            'themes/answers-hitchhiker-theme/cards/card2'
          ]
        }
      }
    });
  });

  it('describes directanswercard', () => {
    expect(descriptions.directanswercard).toEqual({
      displayName: 'Add Direct Answer Card',
      params: {
        name: {
          displayName: 'Direct Answer Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: [
            'themes/answers-hitchhiker-theme/directanswercards/card1',
            'themes/answers-hitchhiker-theme/directanswercards/card2'
          ]
        }
      }
    });
  });
});