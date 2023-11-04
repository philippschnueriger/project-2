describe('Search Form Tests', () => {
    beforeEach(() => {
      // Visit the page with the form
      cy.visit('/');
    });
    it('Should submit the form with valid data', () => {  
      // Fill in "From" field
      cy.get('#cityFrom').type('{selectall}{del}');
      cy.get('#cityFrom').type('New York');
  
      // Fill in "To" field
      cy.get('#cityTo').type('{selectall}{del}');
      cy.get('#cityTo').type('Los Angeles');
  
      // Fill in "Departure Date" field
      cy.get('#departureDate').type('{selectall}{del}');
      cy.get('#departureDate').type('2023-11-01');
  
      // Check "Trains only" checkbox
      cy.get('#trains').click();
  
      // Submit the form
      cy.get('button[type=submit]').click();
  
      // Verify that correct url is called
      cy.url().should('eq', 'http://localhost:4200/results?cityFrom=new-york-city_ny_us&cityTo=los-angeles_ca_us&departureDate=20%2F02%2F3110&trains=true');
    });
  
    it('Should display error messages for invalid data', () => {
  
      // Submit the form with empty fields
      cy.get('#cityFrom').type('{selectall}{del}');
      cy.get('button[type=submit]').should('be.disabled')

      // Get a warning for invalid inputs
      cy.get('#cityTo').type('{selectall}{del}');
      cy.get('#trains').click();
      cy.get('.alert-danger').should('have.length', 2);
    });
  });
  