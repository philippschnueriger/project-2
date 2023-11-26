describe('Navigation Tests', () => {
    it('should navigate to different pages', () => {
      // Visit the home page
      cy.visit('/');
  
      // Find a navigation element (e.g., a link) and click it
      cy.get('[routerLink="/favourites"]').first().click();
  
      // Check if the URL has changed to the target page (e.g., favourites page)
      cy.url().should('include', '/login');
  
      // Check if the content specific to the login page is visible
      cy.get('h1').contains('Welcome to TripSearch').should('be.visible');
  
      // Go back to the previous page
      cy.go('back');
  
      // Check if the URL has reverted back to the initial page
      cy.url().should('not.include', '/favourites');
  
      // Check if the content specific to the initial page is visible
      cy.contains('Where do you want to go').should('be.visible');
  
      // You can continue to add more navigation tests as needed.
      cy.get('a[href="/destinations"]').first().click();

      cy.contains('a', 'Home').should('have.attr', 'href', '/').click();
    });
  });
  