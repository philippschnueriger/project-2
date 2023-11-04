// Create a new Cypress test file, e.g., login.spec.js

describe('Login Functionality', () => {
    let credentials: any;
    beforeEach(() => {
        // Load the credentials fixture
        cy.fixture('credentials').then((creds) => {
          credentials = creds;
        });
        // Visit the login page
        cy.visit('/login');
      });
    it('Should successfully log in', () => {
      // Assuming there are input fields for username and password
      cy.get('#userName').type(credentials.username);
      cy.get('#userPassword').type(credentials.password);
  
      // Assuming there's a submit button
      cy.get('button[type=submit]').click();
  
      // Assuming there's a success message or redirect after successful login
      cy.url().should('have.string', '/profile');
    });

    it('Should successfully log out', () => {        
        // Assuming there's a logout button
        cy.get('#logout').click();
    
        // Assuming there's a success message or redirect after successful login
        cy.url().should('have.string', '/login');
      });
  
    it('Should display an error for incorrect credentials', () => {  
      // Assuming there are input fields for username and password
      cy.get('#userName').type(credentials.username);
      cy.get('#userPassword').type('incorrect_password');
  
      // Assuming there's a submit button
      cy.get('button[type=submit]').click();
  
      // Assuming there's an error message displayed
      cy.url().should('not.have.string', '/profile');
    });
  });
  