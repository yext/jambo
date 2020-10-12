const CommandDescriber = require('../../../src/commands/describe/commanddescriber');

describe('CommandDescriber works correctly', () => {
  const repoAnalyzer = {
    getThemes() {
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
      return ['card1', 'card2'];
    },
    getDirectAnswerCards() {
      return ['dacard1', 'dacard2'];
    }
  };
  const commandDescriber = new CommandDescriber(repoAnalyzer);
  const descriptions = commandDescriber._getCommandDescriptions()

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
          type: 'string',
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
          options: ['card1', 'card2']
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
          options: ['dacard1', 'dacard2']
        }
      }
    });
  });
});