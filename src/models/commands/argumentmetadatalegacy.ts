/**
 * Defines the different kinds of arguments that are supported.
 */
 type ArgumentType = 'string' | 'number' | 'boolean' | 'array';

 /**
  * An interface describing the legacy version of {@link ArgumentMetadata}.
  * @deprecated
  */
 export interface ArgumentMetadataLegacy {
   /**
    * The type of the argument, e.g. 'string', 'boolean', etc.
    */
   getType(): ArgumentType
 
   /**
    * The type of the elements of an array argument.
    */
   getItemType(): ArgumentType | undefined
 
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