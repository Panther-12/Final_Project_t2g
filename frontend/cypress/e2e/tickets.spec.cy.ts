describe('Organizer Tickets', () => {
  beforeEach(() => {
    // Login as Organizer
    cy.visit('/users/auth/login');
    cy.get('input#email').type('sonniemwati36@gmail.com');
    cy.get('input#password').type('12@sS01717i3?');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/analytics');

    // Set role in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('role', 'organizer');
    });

    // Visit Organizer Tickets Page
    cy.visit('/admin/tickets');
  });

  it('should display all required elements', () => {
    cy.get('h2').contains('Tickets');
    cy.get('button#addticket').should('be.visible');
    cy.get('table').should('be.visible');
    cy.get('table thead tr th').should('have.length', 5); // 5 columns in the table
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should display ticket actions for organizer', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('button').contains('Edit').should('be.visible');
    });
  });

  // it('should handle pagination', () => {
  //   cy.get('.pagination .page-item').should('have.length.at.least', 1);
  //   cy.get('.pagination .page-item').contains('Next').click();
  //   cy.get('tbody tr').should('have.length.at.least', 1);
  // });

  it('should open and interact with the Add Ticket Modal', () => {
    cy.get('button#addticket').click();
    cy.get('.modal-header h5').contains('Add Ticket');
    cy.get('form').within(() => {
      cy.get('#event').select('Concert');
      cy.get('#type').type('Regular');
      cy.get('#price').type('1000');
      cy.get('#quantity').type('50');
      cy.get('button[type="submit"]').contains('Save').click();
    });
    cy.get('.modal-header').should('not.exist'); // Modal should close after save
  });

  it('should edit the added ticket', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('button').contains('Edit').click();
    });
    cy.get('.modal-header h5').contains('Edit Ticket');
    cy.get('form').within(() => {
      cy.get('#type').clear().type('VVIP');
      cy.get('#price').clear().type('1500');
      cy.get('#quantity').clear().type('75');
      cy.get('button[type="submit"]').contains('Save').click();
    });
    cy.get('.modal-header').should('not.exist'); // Modal should close after save

    // Verify the changes in the ticket list
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'VVIP'); // Type
      cy.get('td').eq(2).should('contain', '75'); // Quantity
      cy.get('td').eq(3).should('contain', 'Ksh.1,500.00'); // Price
    });
  });

});
