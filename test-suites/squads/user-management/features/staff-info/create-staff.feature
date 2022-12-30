@cms @user @staff-info
Feature: Create staff account

    Background:
        Given "school admin" logins CMS

    @blocker
    Scenario Outline: Create staff successfully
        When school admin creates a staff with "<validCondition>"
        Then school admin sees newly created staff with "<validCondition>" on CMS

        Examples:
            | validCondition        |
            | only mandatory inputs |
            | all valid inputs      |

    Scenario Outline: Create staff failed
        When school admin creates a staff with "<invalidCondition>"
        Then school admin sees the "<errorMessage>" message
        And school admin sees the staff with new data is not saved

        Examples:
            | invalidCondition            | errorMessage                 |
            | empty name                  | This field is required       |
            | empty email                 | This field is required       |
            | empty location              | This field is required       |
            | invalid email format        | Email address is not valid   |
            | existed email               | Email address already exists |
            | invalid phone number format | Phone number is not valid    |
            | duplicate phone number      | Duplicate phone number       |
