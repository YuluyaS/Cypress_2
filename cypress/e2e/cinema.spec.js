describe('Тесты проверки главной страницы qamid.tmweb.ru', () => {
  let selectors;

  before(() => {
    cy.fixture('selectors/cinemaSelectors').then((sel) => {
      selectors = sel;
    });
  });

  beforeEach(() => {
    cy.visit('https://qamid.tmweb.ru');
  });

  it('1. Проверка заголовка страницы', () => {
    cy.title().should('eq', 'ИдёмВКино');
  });

  it('2. Проверка наличия основных элементов на странице', () => {
    const s = selectors.header;
    cy.get(s.nav).should('be.visible');
    cy.get(s.navDay).should('have.length.at.least', 7);
    
    cy.get(selectors.movie.card).should('have.length.greaterThan', 0);
  });

  it('3. Проверка наличия всех дней недели в навигации', () => {
    const h = selectors.header;

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    cy.get(h.navDayWeek).should('have.length', 7)
      .then($els => {
        const displayedDays = Cypress.$.makeArray($els).map(el => el.innerText);
        daysOfWeek.forEach(day => {
          expect(displayedDays).to.include(day);
        });
      });
  });

  it('4. Проверка формата даты в навигации', () => {
    const h = selectors.header;
    // Проверяем, что число дня отображается как одно или двузначное число
    cy.get(h.navDayNumber).first()
      .invoke('text')
      .should('match', /^\d{1,2}$/) // Только цифры (1 или 2 знака)
      .and('not.be.empty'); // И не пустое
  });

  it('5. Проверка структуры карточки фильма', () => {
    const m = selectors.movie;

    cy.get('.movie').first().within(() => {
      cy.get(m.poster).should('be.visible');
      cy.get(m.title).should('be.visible');
      cy.get(m.synopsis).should('be.visible');
      cy.get(m.data).should('be.visible');
      cy.get(m.seances).should('be.visible');
    });
  });

  it('6. Проверка наличия сеансов у фильмов', () => {
    const m = selectors.movie;

    cy.get(m.seanceTime).should('have.length.greaterThan', 0);
    cy.get(m.seanceTime).first().invoke('text').should('match', /\d{1,2}:\d{2}/);
  });

  it('9. Проверка переключения дней в навигации', () => {
    const h = selectors.header;

    // Кликаем на следующий день
    cy.get(h.navDay).eq(1).click();
    
    // Проверяем, что у выбранного дня появился модификатор
    cy.get(h.navDay).eq(1).should('have.class', 'page-nav__day_chosen');
    cy.get(h.navDay).eq(0).should('not.have.class', 'page-nav__day_chosen');
  });
});