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
      title: {{ translateJS phrase='Hello' }} + {{ translateJS phrase='The man' }}, // The header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      details: {{ translateJS phrase='Some item [[name]]' pluralForm='Some items [[name]]' name=profile.name count=profile.count }}, // The text in the body of the card
      intermixed: {{ translateJS
        phrase='<a href="https://www.yext.com">View our website [[name]]</a>'
        pluralForm='<a href="https://www.yext.com">View our websites [[name]]</a>'
        count=2
        name=name
      }},
      singleQuote: {{ translateJS phrase='The dog\'s bone' }},
      pluralizedSingleQuote: {{ translateJS phrase='The person' pluralForm='The people' context='male' count=myCount}},
      showMoreDetails: {
        showMoreLimit: 750, // Character count limit
        showMoreText: 'Show more', // Label when toggle will show truncated text
        showLessText: 'Show less' // Label when toggle will hide truncated text
      },
      CTA1: {
        label: {{translateJS
          phrase='Mail now [[id1]]'
          context='Mail is a verb'
          id1=profile.name
        }}, // The CTA's label
        label2: {{translateJS phrase='[[name]]\'s mail' name=myName}},
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions()
      },
      CTA2: {
        label: {{ translateJS phrase='<span class="yext">The dog\'s bone</span>' }},
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
