/**
 * defines the different kinds of argument that are supported.
 */
 type ArgumentType = 'string' | 'number' | 'boolean' | 'array';

 /**
  * An interface describing the legacy version of {@link ArgumentMetadata}.
  */
 export interface ArgumentMetadataLegacy {
   /**
    * The type of the argument, e.g. STRING, BOOLEAN, etc.
    */
   getType(): ArgumentType
 
   /**
    * The type of the elements of an array argument.
    */
   getItemType(): string | undefined
 
   /**
    * The description of the argument.
    */
   getDescription(): string
 
   /**
    * A boolean indicating if the argument is required.
    */
   isRequired(): boolean | undefined
 
   /**
    * Optional, a default value for the argument.
    */
   defaultValue(): string | boolean | number | undefined
 }

 /**
  * Returns true if the provided metadata object is the legacy model
  */
 export function isArgumentMetadataLegacy(metadata: any): metadata is ArgumentMetadataLegacy {
  return metadata.getType !== undefined;
 }