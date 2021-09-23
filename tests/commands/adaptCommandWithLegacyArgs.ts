import adaptCommandWithLegacyArgs, {
  CommandClassWithLegacyArguments
} from '../../src/commands/adaptCommandWithLegacyArgs';
import { StringArrayMetadata, StringMetadata } from '../../src/models/commands/concreteargumentmetadata';
import TestCommandWithLegacyArgs from '../fixtures/customcommands/TestCommandWithLegacyArgs';
import TestCommandWithLegacyArgsNoDescribe from '../fixtures/customcommands/TestLegacyCommandWithLegacyArgsNoDescribe';

describe('can adapt a command with static methods that uses legacy argument metadata', () => {
  const command: CommandClassWithLegacyArguments = TestCommandWithLegacyArgs;
  const adaptedCommand = adaptCommandWithLegacyArgs(command);
  const args = adaptedCommand.args();

  it('argument parameters appear as expected', () => {
    expect(args.stringParam instanceof StringMetadata).toBeTruthy();
    expect(args.arrayOfStrings instanceof StringArrayMetadata).toBeTruthy();
  });

  it('getAlias/getShortDescription', () => {
    expect(adaptedCommand.getAlias()).toEqual('TestCommandWithLegacyArgs')
    expect(adaptedCommand.getShortDescription()).toEqual('a command with legacy args')
  });

  it('execute and describe exist and run without error', () => {
    expect(typeof adaptedCommand.describe).toEqual('function');
    adaptedCommand.describe({});
    const instance = new adaptedCommand({});
    expect(typeof instance.execute).toEqual('function');
    instance.execute({});
  });

  it('importing a legacy command without a describe function works', () => {
    const commandNoDescribe: CommandClassWithLegacyArguments = TestCommandWithLegacyArgsNoDescribe;
    const adaptedCommandNoDescribe = adaptCommandWithLegacyArgs(commandNoDescribe);
    expect(adaptedCommandNoDescribe.describe({})).toBeUndefined();
  });
});
