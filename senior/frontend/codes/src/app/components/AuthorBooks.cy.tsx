import React from 'react'
import AuthorBooks from './AuthorBooks'

describe('<AuthorBooks />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AuthorBooks />)
  })
})