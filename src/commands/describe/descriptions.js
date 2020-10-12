/**
 * @param {Array<string>} themes the available themes
 */
exports.init = function(themes) {
  return {
    displayName: 'Initialize Jambo',
    params: {
      theme: {
        displayName: 'Theme',
        type: 'singleoption',
        options: themes
      },
      addThemeAsSubmodule: {
        displayName: 'Add Theme as Submodule',
        type: 'boolean',
        default: true
      }
    }
  }
}

/**
 * @param {Array<string>} pages the available page templates
 */
exports.page = function(pages) {
  return {
    displayName: 'Add Page',
    params: {
      name: {
        displayName: 'Page Name',
        type: 'string',
        required: true
      },
      template: {
        displayName: 'Page Template',
        type: 'singleoption',
        options: pages
      }
    }
  }
}

/**
 * @param {Array<string>} themes the available themes
 */
exports.import = function(themes) {
  return {
    displayName: 'Import Theme',
    params: {
      theme: {
        displayName: 'Theme',
        type: 'string',
        required: true,
        options: themes
      },
      addAsSubmodule: {
        displayName: 'Add as Submodule',
        type: 'boolean',
        default: true
      }
    }
  }
}

/**
 * @param {Array<string>} files paths to all theme files, relative to the jambo config
 */
exports.override = function(files) {
  return {
    displayName: 'Override Theme',
    params: {
      path: {
        displayName: 'Path to Override',
        type: 'filesystem',
        required: true,
        options: files
      }
    }
  }
}

exports.upgrade = function() {
  return {
    displayName: 'Upgrade Theme',
    params: {
      isLegacy: {
        displayName: 'Is Legacy Upgrade',
        type: 'boolean'
      },
      disableScript: {
        displayName: 'Disable Upgrade Script',
        type: 'boolean'
      }
    }
  }
}

exports.build = function() {
  return {
    displayName: 'Build Pages'
  }
}

/**
 * @param {Array<string>} cards all available cards
 */
exports.card = function(cards) {
  return {
    displayName: 'Add Card',
    params: {
      name: {
        displayName: 'Card Name',
        required: true,
        type: 'string'
      },
      templateCardFolder: {
        displayName: 'Template Card Folder',
        required: true,
        type: 'singleoption',
        options: cards
      }
    }
  }
}

/**
 * @param {Array<string>} cards all available direct answer cards
 */
exports.directanswercard = function(directanswercards) {
  return {
    displayName: 'Add Direct Answer Card',
    params: {
      name: {
        displayName: 'Direct Answer Card Name',
        required: true,
        type: 'string'
      },
      templateCardFolder: {
        displayName: 'Template Card Folder',
        required: true,
        type: 'singleoption',
        options: directanswercards
      }
    }
  }
}
