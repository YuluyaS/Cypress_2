describe('Бронирование фильма через UI с данными из админки', () => {
    let credentials;
    let selectors;
    let availableHalls = [];
  
    before(() => {
      cy.fixture('adminCredentials').then((data) => {
        credentials = data;
      });
      cy.fixture('selectors/adminSelectors').then((sel) => {
        selectors = sel;
      });
      cy.fixture('selectors/bookingSelectors').then((sel) => {
        selectors = {...selectors, ...sel};
      });
    });
  
    it('1. Получение списка залов из админки', () => {
      cy.visit('http://qamid.tmweb.ru/admin');
      
      const s = selectors.loginForm;
      cy.get(s.emailInput).type(credentials.valid.email);
      cy.get(s.passwordInput).type(credentials.valid.password);
      cy.get(s.submitButton).click();
  
      cy.get(selectors.adminPage.hallsList).each(($el) => {
        const hallName = $el.text().replace('удалить', '').trim();
        availableHalls.push(hallName);
      }).then(() => {
        cy.wrap(availableHalls).should('not.be.empty');
      });
    });
  
    it('2. Бронирование билета в случайный доступный зал', () => {
      const s = selectors.bookingPage;
      cy.visit('http://qamid.tmweb.ru');
      
      cy.get(s.dayNav).eq(1).click();
  
      const randomHall = availableHalls[Math.floor(Math.random() * availableHalls.length)];
      cy.log(`Выбран зал: ${randomHall}`);
  
      cy.contains(s.hallContainer, randomHall).then(($hall) => {
        if ($hall.length > 0) {
          cy.wrap($hall).find(s.seanceTime).first().click();
          cy.get(s.seat).eq(0).click();
          cy.get(s.seat).eq(1).click();
          cy.get(s.acceptButton).click();
          cy.get(s.acceptButton).click();
          
          cy.get(s.ticketQR).should('be.visible');
          cy.get(s.ticketTitle).should('contain', 'Электронный билет');
        }
      });
    });
  });