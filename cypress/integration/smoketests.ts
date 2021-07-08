describe('The Home Page', () => {
  it('has a working comparator modal', () => {
    cy.visit('/')

    cy.get('[id^=downshift-0-input]')
      .click()
      .type('testing-library/dom-testing-library')
    cy.wait(5000)
    cy.contains('p', 'testing-library/dom-testing-library').click()

    // TODO: make selecting first version specific to the first selector box

    cy.contains('select', 'Choose a release').select('v6.16.0')
    cy.url().should(
      'eq',
      'http://localhost:3000/?repo=testing-library%2Fdom-testing-library&from=v6.16.0'
    )

    // TODO: Select v8.1.0 from second version dropdown box
  })
})

describe('Comparator smoketest', () => {
  it('with standard query string shows expected results', () => {
    cy.visit(
      '/?repo=testing-library%2Fdom-testing-library&from=v6.16.0&to=v8.1.0'
    )

    // Confirm from and to version range are displayed

    cy.contains('Changes from v6.16.0 to v8.1.0')

    // Confirm versions are mentioned somewhere

    cy.contains('v6.16.0')
    cy.contains('v8.1.0')

    cy.contains('h2', 'breaking changes')

    cy.contains('span', 'v7.0.0')

    cy.contains('h5', 'Drop Node 8')
    cy.contains('p', 'Node 10 or greater is required.')
    cy.contains('a', 'out of LTS')
    cy.contains('a', '#459')
    cy.contains('a', 'c3ab843')
    cy.contains('a', '#430')

    cy.contains('pre', 'devDependencies')

    cy.contains('h2', 'features')

    cy.contains('h2', 'bug fixes')

    cy.contains('h2', 'reverts')

    cy.contains('h2', 'recommendations')

    cy.contains('h2', 'chore')
  })
})
