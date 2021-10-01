import {
  StringMetadata,
  StringArrayMetadata,
  BooleanMetadata,
  BooleanArrayMetadata,
  NumberMetadata,
  NumberArrayMetadata,
  ArgumentMetadataRecord,
  ConcreteArgumentMetadata,
  ArgumentMetadataImpl
} from './models/commands/concreteargumentmetadata';
import {
  ArgumentMetadata,
  ArgumentType
} from './models/commands/ArgumentMetadata';
import { JamboConfig } from './models/JamboConfig';
import Command from './models/commands/Command';
import {
  CommandExecutable,
  ExecArgs
} from './models/commands/commandexecutable';
import DescribeMetadata, {
  DescribeMetadataParam
} from './models/commands/DescribeMetadata';


export {
  // concrete ArgumentMetadata classes
  StringMetadata,
  StringArrayMetadata,
  BooleanMetadata,
  BooleanArrayMetadata,
  NumberMetadata,
  NumberArrayMetadata,
  ArgumentMetadataRecord,
  ConcreteArgumentMetadata,

  // base ArgumentMetadata class
  ArgumentMetadataImpl,

  // types
  ArgumentMetadata,
  ArgumentType,
  ExecArgs,
  DescribeMetadataParam,

  // interfaces
  JamboConfig,
  Command,
  CommandExecutable,
  DescribeMetadata
};