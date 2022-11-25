@ignore @user
Feature: Login
    User tries to login in SP

    Scenario Outline: Manabie admin tries to login
        Given user is at "login" page
        When user login as "<role>"
        Then user login successfully

        Examples:
            | role         |
            | school admin |
            | admin        |
