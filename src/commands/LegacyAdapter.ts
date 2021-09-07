import Command from '../models/commands/command';
import { ArgumentMetadataImpl, ConcreteArgumentMetadata } from '../models/commands/concreteargumentmetadata';
import { LegacyArgumentMetadata } from '../models/commands/LegacyArgumentMetadata';
import adaptCommandWithLegacyArgs, { CommandClassWithLegacyArguments } from './adaptCommandWithLegacyArgs';
import adaptLegacyCommand, { LegacyCommand } from './adaptLegacyCommand';

type IndeterminateCommand = LegacyCommand | CommandClassWithLegacyArguments | Command<any>;

export default class LegacyAdapter {
  adapt(command: IndeterminateCommand): Command<any> {
    const commandClass = isLegacyCommand(command) ? adaptLegacyCommand(command) : command;
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


