describe('DestinationExplorerComponent', () => {
  beforeEach(() => {
    cy.visit('/destinations');
  });

  it('should display the heading', () => {
    cy.get('.destination-explorer h1').should(
      'have.text',
      'Explore new destinations'
    );
  });

  it('should filter destinations based on region and order', () => {
    cy.get('.sort').click();

    cy.get('#region').click();
    cy.get("button[ng-reflect-value='Europe']").should('be.visible');

    cy.get('#order').click();
    cy.get("button[ng-reflect-value='Random']").should('be.visible');
  });
});
