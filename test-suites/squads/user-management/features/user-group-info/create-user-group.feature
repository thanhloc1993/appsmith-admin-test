@cms
@user @user-group-info

Feature: Create user group

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Create user group
        When school admin creates a user group "<options>"
        Then school admin sees newly created user group "<options>" on CMS
        Examples:
            | options                    |
            | with granted permission    |
            | without granted permission |

    Scenario: Unable to create user group with missing required fields
        When school admin creates a user group with missing required fields
        Then school admin sees the error message "This field is required"
        And school admin can not create a user group

    Scenario Outline: Unable to create user group with missing granted role/granted location
        When school admin creates a user group with missing granted permission required fields
            | name   | grantedRole   | grantedLocations   |
            | <name> | <grantedRole> | <grantedLocations> |
        Then school admin sees the error message "<messages>"
        And school admin can not create a user group
        Examples:
            | name      | grantedRole | grantedLocations | messages                                                    |
            | empty     | not empty   | not empty        | This field is required                                      |
            | empty     | not empty   | empty            | This field is required and Required fields cannot be blank! |
            | empty     | empty       | not empty        | This field is required and Required fields cannot be blank! |
            | empty     | empty       | empty            | This field is required and Required fields cannot be blank! |
            | not empty | empty       | empty            | Required fields cannot be blank!                            |
            | not empty | not empty   | empty            | Required fields cannot be blank!                            |
            | not empty | empty       | not empty        | Required fields cannot be blank!                            |