const DescribeCommand = require('../../../src/commands/describe/describecommand');

const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
const mockJamboConfig = {};
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
        useSubmodules: {
          displayName: 'Use Submodules',
          type: 'boolean'
        }
      }
    }
  }
}

describe('DescribeCommand works correctly', () => {
  let descriptions;
  beforeAll(async () => {
    await new DescribeCommand(
      mockJamboConfig,
      () => [
        mockInitCommand,
      ],
    ).execute();
    descriptions = JSON.parse(consoleSpy.mock.calls[0][0]);
  })

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
        useSubmodules: {
          displayName: 'Use Submodules',
          type: 'boolean'
        }
      }
    });
  });
});