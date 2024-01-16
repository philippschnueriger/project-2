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
    cy.url().should('have.string', '/favourites');
  });

  it('Should successfully log out', () => {
    cy.visit('/account');
    // Assuming there's a logout button
    cy.get('button').contains('Logout').click();
    // Try to visit favourites
    cy.visit('/favourites');
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
    cy.get('.warning').should('be.visible');

    // Assuming the url is still /login
    cy.url().should('have.string', '/login');
  });
});

describe('Password Reset Functionality', () => {
  it('Should display password reset successful', () => {
    let email = 'test123455656@mail.com';
    cy.visit('/login');
    // Assuming ther is an a link for forgot password
    cy.get('a').contains('Forgot your password?').click();
    // Assuming the url is /reset-password
    cy.url().should('have.string', '/reset-password');
    // Assuming there is an input field for email
    cy.get('#userName').type(email);
    // Assuming there is a submit button
    cy.get('button[type=submit]').click();
    // Assuming there is a success message displayed
    cy.get('.success').should('be.visible').contains(email);
  });
});

describe('Signup Functionality', () => {
  it.skip('Should signup successfully', () => {
    const generateRandomString = (length) =>
      Array.from({ length }, () =>
        String.fromCharCode(Math.floor(Math.random() * 62) + 48)
      ).join('');
    let email = generateRandomString(5) + '@test-mail.com';
    cy.visit('/login');
    // Assuming ther is an a link for signup
    cy.get('a').contains('Sign up').click();
    // Assuming the url is /signup
    cy.url().should('have.string', '/signup');
    // Assuming there is an input field for email and password
    cy.get('#userName').type(email);
    cy.get('#userPassword').type(generateRandomString(10));
    // Assuming there is a submit button
    cy.get('button[type=submit]').click();
    // Assuming the user is redirected to /favourites
    cy.url().should('have.string', '/favourites');
  });
});
