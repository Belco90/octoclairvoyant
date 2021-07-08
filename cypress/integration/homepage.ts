describe('The Home Page', () => {
  it('correctly loads and has correct page title', () => {
    cy.visit('/')

    cy.title().should(
      'equal',
      'Comparator | Octoclairvoyant: Compare GitHub changelogs across multiple releases'
    )
  })
})

describe('The Home Page', () => {
  it('successfully loads and displays header text', () => {
    cy.visit('/')

    cy.contains('header', 'Octoclairvoyant')
    cy.contains('header', 'Comparator')
    cy.contains('header', 'About')
  })
})

describe('The Home Page', () => {
  it('successfully loads and displays footer text', () => {
    cy.visit('/')

    cy.contains('footer', 'Created with')
    cy.contains('footer', 'by Mario')
  })
})

describe('The Home Page', () => {
  it('has working link to About page', () => {
    cy.visit('/')

    cy.contains('About').click()

    cy.url().should('include', '/about')
  })
})
