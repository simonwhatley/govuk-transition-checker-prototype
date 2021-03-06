'use strict'

const express = require('express')
const router = express.Router()

const Actions = require('./models/actions')
const Criteria = require('./models/criteria')
const Questions = require('./models/questions')
const Rules = require('./models/rules')

const Helpers = require('./models/helpers')

function checkHasAnswers (req, res, next) {
  if (req.session.data.answers === undefined) {
    res.redirect(req.baseUrl + '/')
  } else {
    next()
  }
}

// TODO: Could this be made into middleware?
function deleteAnswers (answers) {
  if (answers['business-activity'] !== undefined) {
    if (answers['business-activity'].indexOf('business-activity-eu') === -1) {
      if (answers['business-activity-eu'] !== undefined) {
        delete answers['business-activity-eu']
      }
    }
    if (answers['business-activity'].indexOf('business-activity-row') === -1) {
      if (answers['business-activity-row'] !== undefined) {
        delete answers['business-activity-row']
      }
    }
  } else {
    if (answers['business-activity-eu'] !== undefined) {
      delete answers['business-activity-eu']
    }
    if (answers['business-activity-row'] !== undefined) {
      delete answers['business-activity-row']
    }
  }
  return
}

// --------------------------------------------------
// Start
// --------------------------------------------------

router.get('/', (req, res) => {
  delete req.session.data
  res.render('index', {
    actions: {
      start: `${req.baseUrl}/nationality`
    }
  })
})

router.get('/home-v2', (req, res) => {
  delete req.session.data
  res.render('index', {
    hide: [
      'actions'
    ],
    actions: {
      start: `${req.baseUrl}/nationality`
    }
  })
})

// --------------------------------------------------
// Nationality
// --------------------------------------------------

router.get('/nationality', (req, res) => {
  if (req.session.data.answers === undefined) {
    req.session.data.answers = {}
  }

  res.render('question', {
    question: Questions.question('nationality', req.session.data.answers.nationality),
    actions: {
      save: `${req.baseUrl}/nationality`,
      back: req.baseUrl + '/',
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/nationality', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers.nationality === undefined) {
  //   const error = {}
  //   error.fieldName = 'nationality'
  //   error.href = '#nationality'
  //   error.text = 'Choose what nationality you are'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('nationality', req.session.data.answers.nationality),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/nationality`,
        back: req.baseUrl + '/',
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/living`)
  }
})

// --------------------------------------------------
// Living
// --------------------------------------------------

router.get('/living', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('living', req.session.data.answers.living),
    actions: {
      save: `${req.baseUrl}/living`,
      back: `${req.baseUrl}/nationality`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/living', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers.living === undefined) {
  //   const error = {}
  //   error.fieldName = 'living'
  //   error.href = '#living'
  //   error.text = 'Choose where you live'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('living', req.session.data.answers.living),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/living`,
        back: `${req.baseUrl}/nationality`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/employment`)
  }
})

// --------------------------------------------------
// Employment
// --------------------------------------------------

router.get('/employment', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('employment', req.session.data.answers.employment),
    actions: {
      save: `${req.baseUrl}/employment`,
      back: `${req.baseUrl}/living`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/employment', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers.employment === undefined) {
  //   const error = {}
  //   error.fieldName = 'employment'
  //   error.href = '#employment'
  //   error.text = 'Choose what you do'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('employment', req.session.data.answers.employment),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/employment`,
        back: `${req.baseUrl}/living`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/travelling-business`)
  }
})

// --------------------------------------------------
// Travelling for business
// --------------------------------------------------

router.get('/travelling-business', checkHasAnswers, (req, res) => {
  if (req.session.data.answers.living === 'living-uk') {
    res.render('question', {
      question: Questions.question('travelling-business', req.session.data.answers['travelling-business']),
      actions: {
        save: `${req.baseUrl}/travelling-business`,
        back: `${req.baseUrl}/employment`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers['travelling-business']
    res.redirect(`${req.baseUrl}/driving`)
  }
})

router.post('/travelling-business', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers['travelling-business'] === undefined) {
  //   const error = {}
  //   error.fieldName = 'travelling-business'
  //   error.href = '#travelling-business'
  //   error.text = 'Choose whether you travel to the EU for business'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('travelling-business', req.session.data.answers['travelling-business']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/travelling-business`,
        back: `${req.baseUrl}/employment`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/driving`)
  }
})

// --------------------------------------------------
// Drive in the EU
// --------------------------------------------------

router.get('/driving', checkHasAnswers, (req, res) => {
  if (req.session.data.answers.nationality === 'nationality-uk' &&
      req.session.data.answers.living === 'living-eu') {
    res.render('question', {
      question: Questions.question('drive-in-eu', req.session.data.answers['drive-in-eu']),
      actions: {
        save: `${req.baseUrl}/driving`,
        back: `${req.baseUrl}/travelling-business`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers['drive-in-eu']
    res.redirect(`${req.baseUrl}/travelling`)
  }
})

router.post('/driving', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers['drive-in-eu'] === undefined) {
  //   const error = {}
  //   error.fieldName = 'drive-in-eu'
  //   error.href = '#drive-in-eu'
  //   error.text = 'Choose whether you drive in the EU using a UK licence'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('drive-in-eu', req.session.data.answers['drive-in-eu']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/driving`,
        back: `${req.baseUrl}/travelling-business`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/travelling`)
  }
})

// --------------------------------------------------
// Travelling
// --------------------------------------------------

router.get('/travelling', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('travelling', req.session.data.answers.travelling),
    actions: {
      save: `${req.baseUrl}/travelling`,
      back: `${req.baseUrl}/driving`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/travelling', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers.travelling === undefined) {
  //   const error = {}
  //   error.fieldName = 'travelling'
  //   error.href = '#travelling'
  //   error.text = 'Choose where you plan to travel for leisure and tourism'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('travelling', req.session.data.answers.travelling),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/travelling`,
        back: `${req.baseUrl}/driving`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/activities`)
  }
})

// --------------------------------------------------
// Activities
// --------------------------------------------------

router.get('/activities', checkHasAnswers, (req, res) => {
  if (req.session.data.answers.visiting === 'visiting-eu' ||
      req.session.data.answers.visiting === 'visiting-ie' ||
      req.session.data.answers.visiting === 'visiting-uk' ||
      req.session.data.answers['travelling-business'] === 'travel-eu-business') {
    res.render('question', {
      question: Questions.question('activities', req.session.data.answers.activities),
      actions: {
        save: `${req.baseUrl}/activities`,
        back: `${req.baseUrl}/travelling`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers.activities
    res.redirect(`${req.baseUrl}/move-eu`)
  }
})

router.post('/activities', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers.activities === undefined) {
  //   const error = {}
  //   error.fieldName = 'activities'
  //   error.href = '#activities'
  //   error.text = 'Choose what you plan to do when travelling'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('activities', req.session.data.answers.activities),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/activities`,
        back: `${req.baseUrl}/travelling`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/move-eu`)
  }
})

// --------------------------------------------------
// Move to the EU
// --------------------------------------------------

router.get('/move-eu', checkHasAnswers, (req, res) => {
  if (req.session.data.answers.nationality === 'nationality-uk' &&
      (req.session.data.answers.living === 'living-uk' ||
      req.session.data.answers.living === 'living-ie' ||
      req.session.data.answers.living === 'living-row')) {
    res.render('question', {
      question: Questions.question('move-eu', req.session.data.answers['move-eu']),
      actions: {
        save: `${req.baseUrl}/move-eu`,
        back: `${req.baseUrl}/activities`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers['move-eu']
    res.redirect(`${req.baseUrl}/returning`)
  }
})

router.post('/move-eu', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers['move-eu'] === undefined) {
  //   const error = {}
  //   error.fieldName = 'move-eu'
  //   error.href = '#move-eu'
  //   error.text = 'Choose whether you plan to move to the EU or visit for more than 90 days'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('move-eu', req.session.data.answers['move-eu']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/move-eu`,
        back: `${req.baseUrl}/activities`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/returning`)
  }
})

// --------------------------------------------------
// Returning from the EU
// --------------------------------------------------

router.get('/returning', checkHasAnswers, (req, res) => {
  if (req.session.data.answers.nationality === 'nationality-uk' &&
      (req.session.data.answers.living === 'living-eu' ||
      req.session.data.answers.living === 'living-row')) {
    res.render('question', {
      question: Questions.question('returning', req.session.data.answers.returning),
      actions: {
        save: `${req.baseUrl}/returning`,
        back: `${req.baseUrl}/move-eu`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers.returning
    res.redirect(`${req.baseUrl}/family-eu`)
  }
})

router.post('/returning', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers.returning === undefined) {
  //   const error = {}
  //   error.fieldName = 'returning'
  //   error.href = '#returning'
  //   error.text = 'Choose where you are planning to move back to the UK'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('returning', req.session.data.answers.returning),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/returning`,
        back: `${req.baseUrl}/move-eu`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/family-eu`)
  }
})

// --------------------------------------------------
// Family in the EU
// --------------------------------------------------

router.get('/family-eu', checkHasAnswers, (req, res) => {
  if (req.session.data.answers.nationality === 'nationality-row' &&
      req.session.data.answers.living === 'living-uk') {
    res.render('question', {
      question: Questions.question('family-eu', req.session.data.answers['family-eu']),
      actions: {
        save: `${req.baseUrl}/family-eu`,
        back: `${req.baseUrl}/returning`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers['family-eu']
    res.redirect(`${req.baseUrl}/join-family-uk`)
  }
})

router.post('/family-eu', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers['family-eu'] === undefined) {
  //   const error = {}
  //   error.fieldName = 'family-eu'
  //   error.href = '#family-eu'
  //   error.text = 'Choose where you are a family member of an EU, EEA or Swiss citizen'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('family-eu', req.session.data.answers['family-eu']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/family-eu`,
        back: `${req.baseUrl}/returning`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/join-family-uk`)
  }
})

// --------------------------------------------------
// Join family in the UK
// --------------------------------------------------

router.get('/join-family-uk', checkHasAnswers, (req, res) => {
  if ((req.session.data.answers.nationality === 'nationality-eu' ||
      req.session.data.answers.nationality === 'nationality-row') &&
      (req.session.data.answers.living === 'living-eu' ||
      req.session.data.answers.living === 'living-row')) {
    res.render('question', {
      question: Questions.question('join-family-uk', req.session.data.answers['join-family-uk']),
      actions: {
        save: `${req.baseUrl}/join-family-uk`,
        back: `${req.baseUrl}/family-eu`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    delete req.session.data.answers['join-family-uk']
    res.redirect(`${req.baseUrl}/do-you-own-a-business`)
  }
})

router.post('/join-family-uk', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers['join-family-uk'] === undefined) {
  //   const error = {}
  //   error.fieldName = 'join-family-uk'
  //   error.href = '#join-family-uk'
  //   error.text = 'Choose whether you plan to join a family member in the UK who’s from the UK, EU, Switzerland, Norway, Iceland or Liechtenstein'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('join-family-uk', req.session.data.answers['join-family-uk']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/join-family-uk`,
        back: `${req.baseUrl}/family-eu`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/do-you-own-a-business`)
  }
})

// --------------------------------------------------
// Own a business
// --------------------------------------------------

router.get('/do-you-own-a-business', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('do-you-own-a-business', req.session.data.answers['do-you-own-a-business']),
    actions: {
      save: `${req.baseUrl}/do-you-own-a-business`,
      back: `${req.baseUrl}/join-family-uk`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/do-you-own-a-business', checkHasAnswers, (req, res) => {
  const errors = []

  // if (req.session.data.answers['do-you-own-a-business'] === undefined) {
  //   const error = {}
  //   error.fieldName = 'do-you-own-a-business'
  //   error.href = '#do-you-own-a-business'
  //   error.text = 'Choose whether you own or help to run a business or organisation'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('question', {
      question: Questions.question('do-you-own-a-business', req.session.data.answers['do-you-own-a-business']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/do-you-own-a-business`,
        back: `${req.baseUrl}/join-family-uk`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    if (req.session.data.answers['do-you-own-a-business'] === 'does-not-own-operate-business-organisation') {
      res.redirect(`${req.baseUrl}/results`)
    } else {
      res.redirect(`${req.baseUrl}/business-uk-or-eu`)
    }
  }
})

// --------------------------------------------------
// Business registered UK or EU
// --------------------------------------------------

router.get('/business-uk-or-eu', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('business-uk-or-eu', req.session.data.answers['business-uk-or-eu']),
    actions: {
      save: `${req.baseUrl}/business-uk-or-eu`,
      back: `${req.baseUrl}/do-you-own-a-business`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/business-uk-or-eu', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('business-uk-or-eu', req.session.data.answers['business-uk-or-eu']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/business-uk-or-eu`,
        back: `${req.baseUrl}/do-you-own-a-business`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    if (req.session.data.answers['business-uk-or-eu'].indexOf('owns-operates-business-organisation-uk') !== -1) {
      res.redirect(`${req.baseUrl}/employ-eu-citizens`)
    } else {
      res.redirect(`${req.baseUrl}/results`)
    }
  }
})

// --------------------------------------------------
// Employe EU citizens
// --------------------------------------------------

router.get('/employ-eu-citizens', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('employ-eu-citizens', req.session.data.answers['employ-eu-citizens']),
    actions: {
      save: `${req.baseUrl}/employ-eu-citizens`,
      back: `${req.baseUrl}/business-uk-or-eu`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/employ-eu-citizens', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('employ-eu-citizens', req.session.data.answers['employ-eu-citizens']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/employ-eu-citizens`,
        back: `${req.baseUrl}/business-uk-or-eu`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/personal-data`)
  }
})

// --------------------------------------------------
// Personal data
// --------------------------------------------------

router.get('/personal-data', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('personal-data', req.session.data.answers['personal-data']),
    actions: {
      save: `${req.baseUrl}/personal-data`,
      back: `${req.baseUrl}/employ-eu-citizens`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/personal-data', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('personal-data', req.session.data.answers['personal-data']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/personal-data`,
        back: `${req.baseUrl}/employ-eu-citizens`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/eu-uk-government-funding`)
  }
})

// --------------------------------------------------
// UK or EU government funding
// --------------------------------------------------

router.get('/eu-uk-government-funding', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('eu-uk-government-funding', req.session.data.answers['eu-uk-government-funding']),
    actions: {
      save: `${req.baseUrl}/eu-uk-government-funding`,
      back: `${req.baseUrl}/personal-data`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/eu-uk-government-funding', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('eu-uk-government-funding', req.session.data.answers['eu-uk-government-funding']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/eu-uk-government-funding`,
        back: `${req.baseUrl}/personal-data`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/public-sector-procurement`)
  }
})

// --------------------------------------------------
// Public sector procurement
// --------------------------------------------------

router.get('/public-sector-procurement', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('public-sector-procurement', req.session.data.answers['public-sector-procurement']),
    actions: {
      save: `${req.baseUrl}/public-sector-procurement`,
      back: `${req.baseUrl}/eu-uk-government-funding`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/public-sector-procurement', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('public-sector-procurement', req.session.data.answers['public-sector-procurement']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/public-sector-procurement`,
        back: `${req.baseUrl}/eu-uk-government-funding`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/intellectual-property`)
  }
})

// --------------------------------------------------
// Intellectual property
// --------------------------------------------------

router.get('/intellectual-property', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('intellectual-property', req.session.data.answers['intellectual-property']),
    actions: {
      save: `${req.baseUrl}/intellectual-property`,
      back: `${req.baseUrl}/public-sector-procurement`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/intellectual-property', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('intellectual-property', req.session.data.answers['intellectual-property']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/intellectual-property`,
        back: `${req.baseUrl}/public-sector-procurement`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/eu-domain`)
  }
})

// --------------------------------------------------
// .eu domain
// --------------------------------------------------

router.get('/eu-domain', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('eu-domain', req.session.data.answers['eu-domain']),
    actions: {
      save: `${req.baseUrl}/eu-domain`,
      back: `${req.baseUrl}/intellectual-property`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/eu-domain', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('eu-domain', req.session.data.answers['eu-domain']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/eu-domain`,
        back: `${req.baseUrl}/intellectual-property`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/business-activity`)
  }
})

// --------------------------------------------------
// Business activity – Gate question
// --------------------------------------------------

router.get('/business-activity', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('business-activity', req.session.data.answers['business-activity']),
    actions: {
      save: `${req.baseUrl}/business-activity`,
      back: `${req.baseUrl}/eu-domain`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/business-activity', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('business-activity', req.session.data.answers['business-activity']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/business-activity`,
        back: `${req.baseUrl}/eu-domain`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    deleteAnswers(req.session.data.answers)

    if (req.session.data.answers['business-activity'] !== undefined) {
      if (req.session.data.answers['business-activity'].indexOf('business-activity-eu') !== -1) {
        res.redirect(`${req.baseUrl}/business-activity-eu`)
      } else if (req.session.data.answers['business-activity'].indexOf('business-activity-row') !== -1) {
        res.redirect(`${req.baseUrl}/business-activity-row`)
      } else {
        res.redirect(`${req.baseUrl}/business-activity-ni`)
      }
    } else {
      res.redirect(`${req.baseUrl}/business-activity-ni`)
    }
  }
})

// --------------------------------------------------
// Business activity – European Union
// --------------------------------------------------

router.get('/business-activity-eu', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('business-activity-eu', req.session.data.answers['business-activity-eu']),
    actions: {
      save: `${req.baseUrl}/business-activity-eu`,
      back: `${req.baseUrl}/business-activity`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/business-activity-eu', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('business-activity-eu', req.session.data.answers['business-activity-eu']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/business-activity-eu`,
        back: `${req.baseUrl}/business-activity`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    if (req.session.data.answers['business-activity'] !== undefined &&
        req.session.data.answers['business-activity'].indexOf('business-activity-row') !== -1) {
      res.redirect(`${req.baseUrl}/business-activity-row`)
    } else {
      res.redirect(`${req.baseUrl}/business-activity-ni`)
    }
  }
})

// --------------------------------------------------
// Business activity – Rest of the world
// --------------------------------------------------

router.get('/business-activity-row', checkHasAnswers, (req, res) => {
  let back = `${req.baseUrl}/business-activity`
  if (req.session.data.answers['business-activity'] !== undefined &&
      req.session.data.answers['business-activity'].indexOf('business-activity-eu') !== -1) {
    back = `${req.baseUrl}/business-activity-eu`
  }

  res.render('question', {
    question: Questions.question('business-activity-row', req.session.data.answers['business-activity-row']),
    actions: {
      save: `${req.baseUrl}/business-activity-row`,
      back: back,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/business-activity-row', checkHasAnswers, (req, res) => {
  let back = `${req.baseUrl}/business-activity`
  if (req.session.data.answers['business-activity'] !== undefined &&
      req.session.data.answers['business-activity'].indexOf('business-activity-eu') !== -1) {
    back = `${req.baseUrl}/business-activity-eu`
  }

  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('business-activity-row', req.session.data.answers['business-activity-row']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/business-activity-row`,
        back: back,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/business-activity-ni`)
  }
})

// --------------------------------------------------
// Business activity – Northern Ireland
// --------------------------------------------------

router.get('/business-activity-ni', checkHasAnswers, (req, res) => {
  let back = `${req.baseUrl}/business-activity`
  if (req.session.data.answers['business-activity'] !== undefined &&
      req.session.data.answers['business-activity'].indexOf('business-activity-row') !== -1) {
    back = `${req.baseUrl}/business-activity-row`
  } else if (req.session.data.answers['business-activity'] !== undefined &&
      req.session.data.answers['business-activity'].indexOf('business-activity-eu') !== -1) {
    back = `${req.baseUrl}/business-activity-eu`
  }

  res.render('question', {
    question: Questions.question('business-activity-ni', req.session.data.answers['business-activity-ni']),
    actions: {
      save: `${req.baseUrl}/business-activity-ni`,
      back: back,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/business-activity-ni', checkHasAnswers, (req, res) => {
  let back = `${req.baseUrl}/business-activity`
  if (req.session.data.answers['business-activity'] !== undefined &&
      req.session.data.answers['business-activity'].indexOf('business-activity-row') !== -1) {
    back = `${req.baseUrl}/business-activity-row`
  } else if (req.session.data.answers['business-activity'] !== undefined &&
      req.session.data.answers['business-activity'].indexOf('business-activity-eu') !== -1) {
    back = `${req.baseUrl}/business-activity-eu`
  }

  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('business-activity-ni', req.session.data.answers['business-activity-ni']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/business-activity-ni`,
        back: back,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/sector-business-area`)
  }
})

// --------------------------------------------------
// Business sector
// --------------------------------------------------

router.get('/sector-business-area', checkHasAnswers, (req, res) => {
  res.render('question', {
    question: Questions.question('sector-business-area', req.session.data.answers['sector-business-area']),
    actions: {
      save: `${req.baseUrl}/sector-business-area`,
      back: `${req.baseUrl}/business-activity-ni`,
      start: `${req.baseUrl}/`
    }
  })
})

router.post('/sector-business-area', checkHasAnswers, (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('question', {
      question: Questions.question('sector-business-area', req.session.data.answers['sector-business-area']),
      errors: errors,
      actions: {
        save: `${req.baseUrl}/sector-business-area`,
        back: `${req.baseUrl}/business-activity-ni`,
        start: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/results`)
  }
})

// --------------------------------------------------
// Results
// --------------------------------------------------

router.get('/results', checkHasAnswers, (req, res) => {
  let answers = []
  answers = Helpers.flattenObject(req.session.data.answers)

  let rules = []
  rules = Rules.find(req.session.data.answers)

  const results = {}
  results.citizens = Actions.findCitizenActionsByAnswers(answers, rules)

  if (req.session.data.answers['do-you-own-a-business'] === 'owns-operates-business-organisation') {
    results.business = Actions.findActionsByAudience('business')
  }

  const criteria = {}
  criteria.citizens = Actions.findCitizenActionGroupCriteria(answers, rules)

  if (req.session.data.answers['do-you-own-a-business'] === 'owns-operates-business-organisation') {
    criteria.business = Criteria.findCriteriaByAudience('business')
  }

  let back = `${req.baseUrl}/sector-business-area`
  if (req.session.data.answers['do-you-own-a-business'] === 'does-not-own-operate-business-organisation') {
    back = `${req.baseUrl}/do-you-own-a-business`
  }

  res.render('results', {
    results: results,
    criteria: criteria,
    answers: answers,
    rules: rules,
    actions: {
      back: back,
      start: `${req.baseUrl}/`
    }
  })
})

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
