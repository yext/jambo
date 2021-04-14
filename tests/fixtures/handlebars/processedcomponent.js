{{!-- {{ translate phrase="handlebars comments should be ignored"}} --}}
{{> cards/card_component componentName='standard' }}

class standardCardComponent extends BaseCard['standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      title: 'Bonjour' + 'L\'homme', // The header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      details: ANSWERS.processTranslation({0:'Un article [[name]]',1:'Les articles [[name]]'}, {name:profile.name,count:profile.count}, profile.count), // The text in the body of the card
      intermixed: ANSWERS.processTranslation({0:'<a href="https://www.yext.com">Voir notre site web [[name]]</a>',1:'<a href="https://www.yext.com">Voir nos sites web [[name]]</a>'}, {count:2,name:name}, 2),
      singleQuote: 'L\'os du chien',
      pluralizedSingleQuote: ANSWERS.processTranslation({0:'L\'homme',1:'Les hommes'}, {count:myCount}, myCount),
      showMoreDetails: {
        showMoreLimit: 750, // Character count limit
        showMoreText: 'Show more', // Label when toggle will show truncated text
        showLessText: 'Show less' // Label when toggle will hide truncated text
      },
      CTA1: {
        label: ANSWERS.processTranslation('Mail maintenant [[id1]]', {id1:profile.name}), // The CTA's label
        label2: ANSWERS.processTranslation('[[name]]\'s mail', {name:myName}),
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions()
      },
      CTA2: {
        label: '<span class="yext">L\'os du chien</span>',
        iconName: 'chevron',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions()
      }
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/standard';
  }
}

ANSWERS.registerTemplate(
  'cards/standard',
  `{{{read 'cards/standard/template' }}}`
);
ANSWERS.registerComponentType(standardCardComponent);
