@ignore @user

Feature: Redirect user to previous url after unauthenticated login

  Scenario: User is redirected to previous url after unauthenticated login
    Given user is unauthenticated
    And user goes to a page other than home page
    When user login
    Then user is redirect to previous url