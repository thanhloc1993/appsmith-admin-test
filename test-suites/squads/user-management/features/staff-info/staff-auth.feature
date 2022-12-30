@cms
@user @staff-info
@ignore

Feature: Staff authentication

    Background:
        Given "school admin" logins CMS

    Scenario: Staff login successfully
        Given school admin has created a new user group with teacher role
        When school admin creates a new staff with the created user group
        Then staff logins Teacher App successfully after forgot password

    Scenario Outline: Staff login failed with invalid role
        Given school admin has created a new user group with "<invalidRole>"
        When school admin creates a new staff with the created user group
        Then staff "can not" login to Teacher App after forgot password
        Examples:
            | invalidRole |
            | no role     |
            | admin role  |

    Scenario Outline: Staff login failed with invalid login info
        Given school admin has created a new user group with teacher role
        When school admin creates a new staff with the created user group
        And staff logins to Teacher App with "<invalidLoginInfo>"
        Then staff sees the "<errorMessage>"
        Examples:
            | invalidLoginInfo   | errorMessage                                                                  |
            | blank              | This field is required                                                        |
            | wrong organization | The organization ID you entered could not be found                            |
            | wrong username     | Account information is incorrect. Please check again or contact Manabie staff |
            | wrong password     | Account information is incorrect. Please check again or contact Manabie staff |
