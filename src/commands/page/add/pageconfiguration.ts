/**
 * PageConfiguration contains all of the configuration information
 * needed to create a new page in a Jambo repository.
 */

export default interface PageConfiguration {
  name: string;
  layout: string;
  theme: string;
  template: string;
  locales: string[];
}
