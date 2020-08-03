class MockComponent {
  constructor() {
    this.translations = [
      `{{{translate 'Regular translation in js'}}}`,
      `{{{translate '{someVar} translation in js' someVar='Interpolated'}}}`,
      `{{translateN '{count} translation in js' '{count} translations' count='2'}}`,
      `{{translateN
        '{count} translation with {someVar} in js'
        '{count} translations with {someVar} in js'
        count='2'
        someVar='interpolation'
      }}`,
      `{{translateC 'Translation with context in js' 'This is a test translation'}}`,
      `{{translateC
        '{another} translation with context in js'
        'This is another test translation with context in js'
        another='Another'
      }}`,
      `{{translateCN
        '{count} plural translation with context in js'
        '{count} plural translations with context in js'
        'This is a plural translation with context'
        count='9000'
      }}`
    ];
  }
}