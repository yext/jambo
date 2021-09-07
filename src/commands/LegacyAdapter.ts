import path from 'path';
import UserError from '../errors/usererror';
import Command from '../models/commands/command';
import { ArgumentMetadataImpl, ConcreteArgumentMetadata } from '../models/commands/concreteargumentmetadata';
import { LegacyArgumentMetadata } from '../models/commands/LegacyArgumentMetadata';
import adaptCommandWithLegacyArgs, { CommandClassWithLegacyArguments } from './adaptCommandWithLegacyArgs';
import adaptLegacyCommand, { LegacyCommand } from './adaptLegacyCommand';

type IndeterminateCommand = LegacyCommand | CommandClassWithLegacyArguments | Command<any>;

export default class LegacyAdapter {
  adapt(
    command: IndeterminateCommand,
    filePath: string
  ): Command<any> {
    const commandClass = isLegacyCommand(command) ? adaptLegacyCommand(command) : command;
    if (!isValidCustomCommand(commandClass)) {
      throw new UserError(`Command in ${path.basename(filePath)} was not formatted properly`);
    }
    const commandClassWithModernArgs =
      isCommandClassWithLegacyArguments(commandClass)
        ? adaptCommandWithLegacyArgs(commandClass)
        : commandClass;
    return commandClassWithModernArgs;
  }
}

/**
 * Checks whether a command is a legacy command.
 *
 * @param command The require'd module.
 * @returns whether this is a legacy command import.
 */
function isLegacyCommand(command: IndeterminateCommand): command is LegacyCommand {
  return !('prototype' in command);
}
/**
 * Checks whether a custom command class has any arguments that are LegacyArgumentMetadata.
 */
function isCommandClassWithLegacyArguments(
  command: CommandClassWithLegacyArguments | Command<any>
): command is CommandClassWithLegacyArguments {
  function isLegacyArgs(args: Record<string, ConcreteArgumentMetadata | LegacyArgumentMetadata>) {
    return Object.values(args).some(metadata => {
      return !(metadata instanceof ArgumentMetadataImpl);
    });
  }
  return isLegacyArgs(command.args());
}

/**
 * Validates an imported custom {@link Command} by ensuring the class has all
 * of the expected static and instance methods.
 *
 * @param commandClass The custom {@link Command}'s class
 * @returns A boolean indicating if the custom {@Command} is valid.
 */
function isValidCustomCommand(commandClass) {
  try {
    const getMethods = (classObject) => Object.getOwnPropertyNames(classObject)
      .filter(propName => typeof classObject[propName] === 'function');

    const staticMethods = getMethods(commandClass);
    const expectedStaticMethods =
      ['getAlias', 'getShortDescription', 'args', 'describe'];

    const instanceMethods = getMethods(commandClass.prototype);
    const expectedInstanceMethods = ['execute'];

    return expectedStaticMethods.every(method => staticMethods.includes(method)) &&
      expectedInstanceMethods.every(method => instanceMethods.includes(method));
  } catch {
    return false;
  }
}
