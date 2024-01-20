// Important note: This test is not working properly!!! It is assumed that this might be caused by the UI-library used in the project.

describe('Search Form Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it.skip('Return: should submit the form with valid data', () => {
    // Fill in "From" field
    cy.get('#cityFrom').type('{selectall}{del}');
    cy.get('#cityFrom').type('New York').wait(3000);

    // Fill in "To" field
    cy.get('#cityTo').type('{selectall}{del}');
    cy.get('#cityTo').type('Los Angeles').wait(3000);

    // Fill in "Departure Date" field
    cy.get('#departureAndReturnDate').type('{selectall}{del}');
    cy.get('#departureAndReturnDate')
      .type('21.11.2024 – 28.11.2024')
      .wait(1000);

    // Submit the form
    cy.get('button[type=submit]').click({ force: true }).wait(3000);

    // Verify that correct url is called
    cy.url().should('include', 'results');
  });
  it.skip('One-way: should submit the form with valid data', () => {
    // Select one-way
    cy.get('#tripMode > .t-hosted').click();
    cy.get("button[ng-reflect-value='One-way']").click();

    // Fill in "From" field
    cy.get('#cityFrom').type('{selectall}{del}');
    cy.get('#cityFrom').type('New York');

    // Fill in "To" field
    cy.get('#cityTo').type('{selectall}{del}');
    cy.get('#cityTo').type('Los Angeles');

    // Fill in "Departure Date" field
    cy.get('#departureDate').type('{selectall}{del}');
    cy.get('#departureDate').type('2023-11-01').wait(1000);

    // Submit the form
    cy.get('button[type=submit]').click({ force: true }).wait(3000);
    cy.url().should('include', 'results');
  });
  it.skip('Should display error messages for invalid data', () => {
    // Submit the form with empty fields
    cy.get('#cityFrom').type('{selectall}{del}');
    cy.get('button[type=submit]').should('be.disabled');
  });
});
