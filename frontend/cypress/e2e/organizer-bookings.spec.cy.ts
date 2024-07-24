describe('Organizer Bookings', () => {
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
  
      // Visit Organizer Bookings Page
      cy.visit('/admin/bookings');
    });
  
    it('should display all required elements', () => {
      cy.get('h2').contains('My Bookings');
      cy.get('.card').should('have.length', 4);
      cy.get('.filters input').should('have.length', 3); // Event, User, Ticket Type filters for organizer
      cy.get('table').should('be.visible');
      cy.get('table thead tr th').should('have.length', 7); // 7 columns in the table
    });
  
    it('should display bookings and apply filters', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('.filters input').first().type('Concert');
      cy.get('tbody tr').should('contain', 'Concert');
    });
  
    it('should handle pagination', () => {
      cy.get('#pageSize').select('5');
      cy.get('tbody tr').should('have.length.at.most', 5);
      cy.get('button').contains('Next').click();
      cy.get('tbody tr').should('have.length.at.most', 10);
    });
  });
  