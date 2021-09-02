import UserError from '../errors/usererror';
import { ArgumentMetadata } from '../models/commands/ArgumentMetadata';
import Command from '../models/commands/command';
import { CommandExecutable } from '../models/commands/commandexecutable';
import {
  ConcreteArgumentMetadata,
  StringArrayMetadata,
  StringMetadata,
  NumberArrayMetadata,
  NumberMetadata,
  BooleanArrayMetadata,
  BooleanMetadata,
  ConcreteMetadataClass,
  ArgumentMetadataImpl
} from '../models/commands/concreteargumentmetadata';
import {
  LegacyArgumentItemType,
  LegacyArgumentMetadata,
  LegacyArgumentType
} from '../models/commands/legacyargumentmetadata';
import { JamboConfig } from '../models/JamboConfig';

export interface CommandClassWithLegacyArguments extends Command<any>{
  args(): Record<string, LegacyArgumentMetadata>
}

/**
 * Creates an implementation of the current {@link Command} interface that wraps the
 * a command with legacy args.
 * 
 * @param commandToWrap a command with legacy arguments
 * @returns A wrapper command that handles transforming the args() output
 */
export default function adaptCommandWithLegacyArgs(
  commandToWrap: CommandClassWithLegacyArguments
): Command<any> {
  return class {
    _wrappedInstance: CommandExecutable<any>

    constructor(jamboConfig: JamboConfig) {
      this._wrappedInstance = new commandToWrap(jamboConfig);
    }

    static args() {
      return adaptLegacyArguments(commandToWrap.args());
    }

    static getAlias() {
      return commandToWrap.getAlias();
    }

    static getShortDescription() {
      return commandToWrap.getShortDescription();
    }
    static describe(jamboConfig: JamboConfig) {
      return commandToWrap.describe(jamboConfig);
    }

    execute(args: any) {
      return this._wrappedInstance.execute(args);
    }
  }
}

/**
 * Given an record containing LegacyArgumentMetadata, adapt all legacy instances into
 * up to date ones.
 *
 * @param legacyArgs 
 * @returns 
 */
function adaptLegacyArguments(
  legacyArgs: Record<string, LegacyArgumentMetadata | ConcreteArgumentMetadata>
): Record<string, ConcreteArgumentMetadata> {
  const args: Record<string, ConcreteArgumentMetadata> = {}
  for (const argName in legacyArgs) {
    const argumentMetadata = legacyArgs[argName];
    if (argumentMetadata instanceof ArgumentMetadataImpl) {
      args[argName] = argumentMetadata;
    } else {
      const legacyArg = argumentMetadata;
      const type = legacyArg.getType();
      const itemType = legacyArg.getItemType();
      const metadata: ArgumentMetadata<any> = {
        description: legacyArg.getDescription(),
        isRequired: legacyArg.isRequired(),
        defaultValue: legacyArg.defaultValue()
      }
      const MetadataClass = createMetadataFromType(type, itemType);
      const adaptedMetadata = new MetadataClass(metadata);
      args[argName] = adaptedMetadata;
    }
  }
  return args;
}

function createMetadataFromType(
  type: LegacyArgumentType,
  itemType?: LegacyArgumentItemType
): ConcreteMetadataClass  {
  function createArrayMetadata() {
    switch(itemType) {
      case 'string': return StringArrayMetadata
      case 'number': return NumberArrayMetadata
      case 'boolean': return BooleanArrayMetadata
      default: throw new UserError(`Unrecognized itemType ${itemType} for legacy argument type ${type}`);
    }
  }
  switch(type) {
    case 'string': return StringMetadata
    case 'number': return NumberMetadata
    case 'boolean': return BooleanMetadata
    case 'array': return createArrayMetadata();
    default: throw new UserError(`Unrecognized legacy argument type ${type}`);
  }
} 
