@ignore @user

Feature: Create a school's admin

    Background:
        Given a "admin" already logs in
        And user goes to school detail page
        When user clicks on create button and see account form

    Scenario: Manabie admin can cancel inside account
        Given user creates new account and cancel
        Then user will not see data in account list

    Scenario: Manabie admin create success an account of school's admin
        When user creates new school admin's account
        Then user sees message "You have created a new account successfully"
        And user will see the newly created account in accounts list

    Scenario: Manabie admin cannot create an account of school's admin because phone or email is existing
        When user creates new school admin's account with email existing
        Then created failed school admin's account with existing unique email
        And user creates new school admin's account with phone number existing
        And created failed school admin's account with existing unique phone number

    Scenario Outline: Manabie admin cannot create an account of school's admin because required field is empty
        When user creates new school admin's account with empty "<field>"
        Then user cannot create any school admin's account

        Examples:
            | field       |
            | name        |
            | phoneNumber |
            | email       |