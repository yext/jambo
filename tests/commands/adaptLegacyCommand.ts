import { CommandClassWithLegacyArguments } from '../../src/commands/adaptCommandWithLegacyArgs';
import adaptLegacyCommand, { LegacyCommand } from '../../src/commands/adaptLegacyCommand';
import TestLegacyCommand from '../fixtures/customcommands/TestLegacyCommand';

describe('can adapt legacy commands', () => {
  const legacyCommand: LegacyCommand = TestLegacyCommand;
  const adaptedCommand = adaptLegacyCommand(legacyCommand) as CommandClassWithLegacyArguments;

  it('argument parameters appear as expected', () => {
    const args = adaptedCommand.args();
    expect(args.stringParam.getType()).toEqual('string');
    expect(args.arrayOfStrings.getType()).toEqual('array');
    expect(args.arrayOfStrings.getItemType()).toEqual('string');
  });

  it('getAlias/getShortDescription', () => {
    expect(adaptedCommand.getAlias()).toEqual('TestLegacyCommand')
    expect(adaptedCommand.getShortDescription()).toEqual('a legacy command for unit tests')
  });

  it('execute and describe exist and run without error', () => {
    expect(typeof adaptedCommand.describe).toEqual('function');
    adaptedCommand.describe({});
    const instance = new adaptedCommand({});
    expect(typeof instance.execute).toEqual('function');
    instance.execute({});
  });
});
