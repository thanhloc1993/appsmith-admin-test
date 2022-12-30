@ignore @user

# TODO: Fix this test for running too long (10 minutes)
Feature: Forgot password

    1 school admin exists in db with email: "tien.tran+school@manabie.com", password: "abc". User does not log in.

    Background:
        Given user goes to the forgot password page

    Scenario: User can reset password successfully
        Given user fills in email with "example+school@gmail.com"
        When user reset password
        Then login page is displayed
        And user receive reset password email

    Scenario: Email is blank
        Given user leaves email empty
        Then user cannot reset password

    Scenario: Fill random characters in email field
        Given user fills in email with "!#$"
        When user reset password
        Then user sees message "The email address is badly formatted."

    Scenario: Account is not existed in system
        Given user fills in email with "example@yahoo.com"
        When user reset password
        Then user sees message "Account information is incorrect. Please check again or contact Manabie staff"

    Scenario: Error Message is not duplicated
        Given user fills in email with "example@yahoo.com"
        When user reset password
        Then user sees only one error message