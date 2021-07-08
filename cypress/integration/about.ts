describe('The about page', () => {
  it('has working link to comparator page', () => {
    cy.visit('/about')

    cy.contains('Comparator').click()

    cy.url().should('equal', 'http://localhost:3000/')
  })
})

describe('The about page', () => {
  it('has correct page title', () => {
    cy.visit('/about')

    cy.title().should(
      'equal',
      'About | Octoclairvoyant: Compare GitHub changelogs across multiple releases'
    )
  })
})

describe('The about page', () => {
  it('contains images which all have a alt attribute', () => {
    cy.visit('/about')
    cy.get('img').each(($el) => {
      cy.wrap($el).should('have.attr', 'alt')
    })
  })
})

describe('The about page', () => {
  it('contains correct hero text', () => {
    cy.visit('/about')
    cy.contains('h1', 'Compare GitHub changelogs across multiple releases')
  })
})

describe('The about page', () => {
  it('contains h2 with features text', () => {
    cy.visit('/about')
    cy.contains('h2', 'Features')
  })
})

describe('The about page', () => {
  it('contains call to action button with correct text', () => {
    cy.visit('/about')
    cy.contains('button', 'Try me now!')
  })
})

describe('The about page', () => {
  it('contains unordered list', () => {
    cy.visit('/about')
    cy.contains('ul', 'Search repositories and pick a version range')
  })
})
