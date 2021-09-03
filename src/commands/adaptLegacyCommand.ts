import Command from '../models/commands/command';
import { LegacyArgumentMetadata } from '../models/commands/legacyargumentmetadata';
import { JamboConfig } from '../models/JamboConfig';
import { CommandClassWithLegacyArguments } from './adaptCommandWithLegacyArgs';

/**
 * The methods provided by the legacy command instance.
 * The first iteration of Jambo custom commands exported a function that took in a {@link JamboConfig},
 * and returned an instance of this interface.
 */
export type LegacyCommand = (jamboConfig: JamboConfig) => {
  getAlias: () => string
  getShortDescription: () => string
  args: () => Record<string, LegacyArgumentMetadata>
  describe: () => void
  execute: (params: any) => void
}

/**
 * Creates an implementation of the current {@link Command} interface that wraps the
 * result of a legacy command import.
 *
 * @param {Function} commandCreator The function provided by a legacy command import.
 * @returns {class} An implemenation of the current {@link Command} interface.
 */
export default function adaptLegacyCommand(commandCreator: LegacyCommand): Command<any> | CommandClassWithLegacyArguments {
  return class {
    _wrappedInstance: ReturnType<LegacyCommand>

    constructor(jamboConfig: JamboConfig) {
      this._wrappedInstance = commandCreator(jamboConfig);
    }

    static getAlias() {
      return commandCreator({}).getAlias();
    }

    static getShortDescription() {
      return commandCreator({}).getShortDescription();
    }

    static args() {
      return commandCreator({}).args();
    }

    static describe(jamboConfig) {
      return commandCreator(jamboConfig).describe();
    }

    execute(args: any) {
      return this._wrappedInstance.execute(args);
    }
  }
}
