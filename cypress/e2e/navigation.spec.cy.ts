describe('Navigation Tests', () => {
  it('should navigate to different pages', () => {
    cy.visit('/');

    cy.get('a[href="/destinations"]').first().click();
    cy.url().should('include', '/destinations');

    cy.get('[routerLink="/favourites"]').first().click();
    cy.url().should('include', '/login');

    cy.get('[routerLink="/shared-favourites"]').first().click();
    cy.url().should('include', '/login');

    cy.get('[routerLink="/account"]').first().click();
    cy.url().should('include', '/login');

    cy.get('[routerLink="/"]').first().click();
    cy.url().should('include', '/');
  });
});
