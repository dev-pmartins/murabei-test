describe('Filtro de Livros', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('filtra por autor', () => {
    cy.get('[data-testid="filter-author"]').type('Alic');
    cy.contains('Alicia Gaspar De Alba').should('exist');
    cy.contains('Alice Leccese Powers').should('exist');
    cy.contains('Alice Walker').should('not.exist');
  });

  it('filtra por título', () => {
    cy.get('[data-testid="filter-title"]').type('Tuscany');
    cy.contains('Tuscany in Mind').should('exist');
    cy.contains('Peru in Mind').should('not.exist');
  });

  it('filtra por assunto', () => {
    cy.get('[data-testid="filter-subjects"]').type('Travel');
    cy.contains('Travel').should('exist');
    cy.contains('Sushi').should('not.exist');
  });

  it('filtrar por editora', () => {
    cy.get('[data-testid="filter-publisher"]').type('Arte Publico Press');
    cy.contains('Arte Publico Press').should('exist');
    cy.contains('University of Thor').should('not.exist');
  });

  it('varios filtros', () => {
    cy.get('[data-testid="filter-author"]').type('Yvonne');
    cy.get('[data-testid="filter-title"]').type('opening');
    cy.get('[data-testid="filter-subjects"]').type('General');
    cy.get('[data-testid="filter-publisher"]').type('Heinemann');
    
    cy.contains('Yvonne Vera').should('exist');
    cy.contains('Opening Spaces: An Anthology of Contemporary African Women\'s Writing').should('exist');
    cy.contains('Heinemann').should('exist');
    cy.contains('General & Miscellaneous Literature Anthologies, Anthologies').should('not.exist');

    cy.contains('Cat & Dog').should('not.exist');
  });
});
