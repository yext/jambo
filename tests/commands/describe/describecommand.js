import DescribeCommand from '../../../src/commands/describe/describecommand';
import { BooleanMetadata, StringMetadata } from '../../../src/models/commands/concreteargumentmetadata';

const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

describe('DescribeCommand can describe a simple command', () => {
  const mockInitCommand = {
    args() {
      return {
        theme: new StringMetadata({
          description: 'the theme',
          isRequired: true
        }),
        useSubmodules: new BooleanMetadata({
          description: 'use submodules'
        })
      }
    },
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
          }
        }
      }
    }
  }
  let descriptions;
  beforeAll(async () => {
    await new DescribeCommand({}, () => [ mockInitCommand ]).execute();
    descriptions = JSON.parse(consoleSpy.mock.calls[0][0]);
    consoleSpy.mockClear();
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
          required: true,
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

it('deprecated params in a command\'s DescribeDefinition ' +
'take precedence over params inferred from that command\'s args()', async () => {
  const mockCommand = {
    args() {
      return {
        myParam: new StringMetadata({
          description: 'the theme',
          isRequired: false,
          defaultValue: 'dont show me in describe'
        })
      }
    },
    getAlias() { return 'mocked'; },
    describe() {
      return {
        displayName: 'lol mocked',
        params: {
          myParam: {
            displayName: 'MY PARAM',
            required: false,
            default: 82,
            type: 'number'
          },
        }
      }
    }
  }

  await new DescribeCommand({}, () => [ mockCommand ]).execute();
  const descriptions = JSON.parse(consoleSpy.mock.calls[0][0]);
  consoleSpy.mockClear();

  expect(descriptions.mocked).toEqual({
    displayName: 'lol mocked',
    params: {
      myParam: {
        displayName: 'MY PARAM',
        required: false,
        default: 82,
        type: 'number',
      }
    }
  });
})