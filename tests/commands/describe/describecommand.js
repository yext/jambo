const DescribeCommand = require('../../../src/commands/describe/describecommand');

const consoleSpy = jest.spyOn(console, 'dir').mockImplementation();
const mockInitCommand = {
  getAlias() {
    return 'init';
  },
  describe() {
    return {
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
    }
  }
}

describe('DescribeCommand works correctly', () => {
  new DescribeCommand(
    () => [
      mockInitCommand,
    ],
  ).execute();
  const descriptions = consoleSpy.mock.calls[0][0];

  it('describes all provided commands and nothing more', () => {
    const expectedCommandNames = [
      'init',
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
});