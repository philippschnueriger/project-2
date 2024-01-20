describe('HomeComponent', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display title and search form', () => {
    cy.get('.home h1').contains('Where do you want to go?');
    cy.get('#cityTo').should('be.visible');
    cy.get('#cityFrom').should('be.visible');
    cy.get('#departureAndReturnDate').should('be.visible');
    cy.get('button[type="submit"]').contains('Search');
  });

  it('should explore destinations when the explore button is clicked', () => {
    cy.get('.img-overlay button.secondary-button')
      .click({ force: true })
      .wait(3000);
    cy.url().should('include', '/results');
  });

  it('should explore specific destination when card is clicked', () => {
    const destination = 'London';
    cy.get('div').contains(destination).click({ force: true }).wait(3000);
    cy.url().should('include', '/results');
    cy.get('#cityTo').contains(destination);
  });

  it('should navigate to destinations page when "Show more" button is clicked', () => {
    cy.get('.align-right button.secondary-button')
      .click({ force: true })
      .wait(3000);
    cy.url().should('include', '/destinations');
  });
});
