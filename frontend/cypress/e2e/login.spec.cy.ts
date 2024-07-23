describe('Login', () => {
  beforeEach(() => {
    cy.visit('/users/auth/login');
  });

  it('should display the login form', () => {
    cy.get('form').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('input#rememberMe').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
    cy.get('a[routerLink="/users/auth/register"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.get('div.text-danger').should('contain', 'Please enter a valid email address');
    cy.get('div.text-danger').should('contain', 'Please enter your password');
  });

  it('should login with valid credentials', () => {
    cy.get('input#email').type('nimrodnyongesa7@gmail.com');
    cy.get('input#password').type('12@17Y017g3sa?');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/analytics');
  });
});
