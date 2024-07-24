describe('Events', () => {
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

    // Visit Events Page
    cy.visit('/admin/events');
  });

  it('should display all required elements', () => {
    cy.get('button#addevent').should('be.visible');
    cy.get('table').should('be.visible');
    cy.get('table thead tr th').should('have.length', 5); // 5 columns in the table (excluding Actions)
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should display event actions for organizer', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('i.fa-edit').should('be.visible');
      cy.get('i.fa-times').should('be.visible');
    });
  });

  // it('should handle pagination', () => {
  //   cy.get('.pagination .page-item').should('have.length.at.least', 1);
  //   cy.get('.pagination .page-item').contains('Next').click();
  //   cy.get('tbody tr').should('have.length.at.least', 1);
  // });

  it('should open and interact with the Add Event Modal', () => {
    cy.get('button#addevent').click();
    cy.get('.modal-header h5').contains('Add Event');

    // Fill out the form fields
    cy.get('input#title').type('Amazon giant');
    cy.get('textarea#description').type('Amazon vibes all the way.');
    cy.get('input#startDate').type('2024-08-01');
    cy.get('input#startTime').type('10:00');
    cy.get('input#endDate').type('2024-08-02');
    cy.get('input#endTime').type('18:00');
    cy.get('select#venueId').select('Innovation Hub');
    cy.get('select#categoryId').select('Afro'); 

    // Simulate image upload
    cy.get('input#images').selectFile(['public/assets/images/event-1.jpg', 'public/assets/images/event-2.jpg'])

    cy.get('button[type="submit"]').contains('Create').click();

    // Click outside the modal to close it
    cy.get('body').click(0, 0);

    // Verify that the modal is not visible
    cy.get('.modal-header').should('not.exist');

    // Verify the event was added
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'Amazon giant');
      // cy.get('td').eq(1).should('contain', '2024-08-01');
      cy.get('td').eq(2).should('contain', 'Amazon vibes all the way.');
      cy.get('td').eq(3).should('contain', 'Innovation Hub');
      cy.get('td').eq(4).should('contain', 'active');
    });
  });

  it('should edit the added event', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('i.fa-edit').click();
    });
    cy.get('.modal-header h5').contains('Edit Event');

    // Edit the form fields
    cy.get('input#title').clear().type('Amazon giant2');
    cy.get('textarea#description').clear().type('Amazon vibes second edition.');
    cy.get('input#startDate').clear().type('2024-08-10');
    cy.get('input#startTime').clear().type('11:00');
    cy.get('input#endDate').clear().type('2024-08-12');
    cy.get('input#endTime').clear().type('19:00');
    cy.get('select#venueId').select('Innovation Hub');
    cy.get('select#categoryId').select('Afro'); 

    cy.get('button[type="submit"]').contains('Update').click();

    // Click outside the modal to close it
    cy.get('body').click(0, 0);

    // Verify that the modal is not visible
    cy.get('.modal-header').should('not.exist');

    // Verify the changes in the event list
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'Amazon giant2');
      // cy.get('td').eq(1).should('contain', '2024-08-10');
      cy.get('td').eq(2).should('contain', 'Amazon vibes second edition.');
      cy.get('td').eq(3).should('contain', 'Innovation Hub');
      cy.get('td').eq(4).should('contain', 'active');
    });
  });
});
