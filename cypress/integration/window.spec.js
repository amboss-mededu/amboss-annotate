/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('cy.window()', () => {
    cy.window().should('have.property', 'adaptor')
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
    cy.title().should('include', 'Test page for AMBOSS annotate')
    cy.get('.amboss-ignore').should('contain', 'Angiotensin-converting enzyme').and('not.contain', 'amboss-anchor')
    cy.get('a[title="Angiotensin-converting enzyme"]').children('amboss-anchor').should('contain', 'Angiotensin-converting enzyme')
  })
})
