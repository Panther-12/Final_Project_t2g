describe('Admin Venues Page', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('/users/auth/login');

    // Perform login
    cy.get('input#email').type('nimrodnyongesa7@gmail.com');
    cy.get('input#password').type('12@17Y017g3sa?');
    cy.get('button[type="submit"]').click();

    // Ensure the user is redirected to the correct page after login
    cy.url().should('include', '/admin/analytics');

    // Navigate to the venues page
    cy.visit('/admin/venues');
  });

  it('should display all required elements on the page', () => {
    // Check if the Add Venue button exists
    cy.get('#addvenue').should('exist');

    // Check if the table headers exist
    cy.get('table thead th').eq(0).should('contain', 'Name');
    cy.get('table thead th').eq(1).should('contain', 'Address');
    cy.get('table thead th').eq(2).should('contain', 'Capacity');
    cy.get('table thead th').eq(3).should('contain', 'Type');
    cy.get('table thead th').eq(4).should('contain', 'Actions');

    // Check if pagination exists
    cy.get('.pagination').should('exist');
  });

  it('should open the Add Venue form when clicking the Add Venue button', () => {
    // Click the Add Venue button
    cy.get('#addvenue').click();

    // Check if the form modal is displayed
    cy.get('.modal-header h4').should('contain', 'Add Venue');

    // Check if the form fields exist
    cy.get('form').within(() => {
      cy.get('#name').should('exist');
      cy.get('#address').should('exist');
      cy.get('#capacity').should('exist');
      cy.get('#type').should('exist');
    });
  });

  it('should fill the Add Venue form and cancel', () => {
    // Click the Add Venue button
    cy.get('#addvenue').click();

    // Fill the form fields
    cy.get('#name').type('Test Venue');
    cy.get('#address').type('123 Test St');
    cy.get('#capacity').type('100');
    cy.get('#type').select('Public');

    // Click the Cancel button
    cy.get('.modal-footer .btn-secondary').click();

    // Check if the form modal is closed
    cy.get('.modal-header h4').should('not.exist');
  });
});
