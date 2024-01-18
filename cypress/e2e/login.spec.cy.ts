describe('Login Functionality', () => {
  let credentials: {
    username: string;
    password: string;
  };
  beforeEach(() => {
    cy.fixture('credentials').then((creds) => {
      credentials = creds;
    });
    cy.visit('/login');
  });
  it('Should successfully log in', () => {
    cy.get('#userName').type(credentials.username);
    cy.get('#userPassword').type(credentials.password);

    cy.get('button[type=submit]').click();
    cy.url().should('have.string', '/favourites');
  });

  it('Should successfully log out', () => {
    cy.visit('/account');
    cy.get('button').contains('Logout').click();

    cy.visit('/favourites');
    cy.url().should('have.string', '/login');
  });

  it('Should display an error for incorrect credentials', () => {
    cy.get('#userName').type(credentials.username);
    cy.get('#userPassword').type('incorrect_password');

    cy.get('button[type=submit]').click();
    cy.get('.warning').should('be.visible');

    cy.url().should('have.string', '/login');
  });
});

describe('Password Reset Functionality', () => {
  it('Should display password reset successful', () => {
    const email = 'test123455656@mail.com';
    cy.visit('/login');

    cy.get('a').contains('Forgot your password?').click();
    cy.url().should('have.string', '/reset-password');

    cy.get('#userName').type(email);
    cy.get('button[type=submit]').click();

    cy.get('.success').should('be.visible').contains(email);
  });
});

describe('Signup Functionality', () => {
  it.skip('Should signup successfully', () => {
    const generateRandomString = (length) =>
      Array.from({ length }, () =>
        String.fromCharCode(Math.floor(Math.random() * 62) + 48)
      ).join('');
    const email = generateRandomString(5) + '@test-mail.com';
    cy.visit('/login');
    cy.get('a').contains('Sign up').click();

    cy.url().should('have.string', '/signup');

    cy.get('#userName').type(email);
    cy.get('#userPassword').type(generateRandomString(10));

    cy.get('button[type=submit]').click();
    cy.url().should('have.string', '/favourites');
  });
});
