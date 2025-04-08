describe('Тесты авторизации в админку qamid.tmweb.ru', () => {
  let credentials;
  let selectors;

  before(() => {
    cy.fixture('adminCredentials').then((data) => {
      credentials = data;
    });
    cy.fixture('selectors/adminSelectors').then((sel) => {
      selectors = sel;
    });
  });

  beforeEach(() => {
    cy.visit('http://qamid.tmweb.ru/admin');
  });

  it('1. Проверка элементов формы авторизации', () => {
    const s = selectors.loginForm;
    cy.get(s.form).should('exist');
    cy.get(s.emailInput)
      .should('be.visible')
      .and('have.attr', 'type', 'email');
    cy.get(s.passwordInput)
      .should('be.visible')
      .and('have.attr', 'type', 'password');
    cy.get(s.submitButton)
      .should('be.visible')
      .and('contain', 'Авторизоваться');
  });

  it('2. Успешная авторизация (Happy Path)', () => {
    const s = selectors.loginForm;
    cy.get(s.emailInput).type(credentials.valid.email);
    cy.get(s.passwordInput).type(credentials.valid.password);
    cy.get(s.submitButton).click();

    const expectedTitles = ['Управление залами', 'Конфигурация залов', 'Конфигурация цен', 'Сетка сеансов', 'Открыть продажи'];

    cy.get(selectors.adminPage.confSteps).should('have.length', 5)
      .then($els => {
        const displayedTitles = Cypress.$.makeArray($els).map(el => el.innerText);
        expectedTitles.forEach(title => {
          expect(displayedTitles).to.include(title);
        });
      });
  });

  it('3. Неудачная авторизация с неверными данными (Sad Path)', () => {
    const s = selectors.loginForm;
    cy.get(s.emailInput).type(credentials.invalid.email);
    cy.get(s.passwordInput).type(credentials.invalid.password);
    cy.get(s.submitButton).click();

    cy.url().should('include', '/admin/scripts/authorization.php');
    cy.get('body')
      .should('be.visible')
      .and('contain', 'Ошибка авторизации');
  });

  it('4. Попытка входа с пустыми полями (Sad Path)', () => {
    const s = selectors.loginForm;
    cy.get(s.submitButton).click();

    cy.get(s.emailInput)
      .then(($input) => {
        expect($input[0].validationMessage).not.to.be.empty;
      });
    cy.get(s.passwordInput)
      .then(($input) => {
        expect($input[0].validationMessage).not.to.be.empty;
      });
    cy.url().should('eq', 'http://qamid.tmweb.ru/admin/');
  });
});