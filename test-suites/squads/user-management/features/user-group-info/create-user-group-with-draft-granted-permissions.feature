@cms
@user @user-group-info

Feature: Add granted location for Teacher role

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Add granted location with parent/all children locations
        When school admin creates a user group with a draft granted permission
        And school admin selects "Teacher" role and "<options>" location
        Then school admin sees "<value>" are selected on location popup
        And school admin sees "<options>" location on granted location field
        Examples:
            | options      | value                   |
            | parent       | parent and all children |
            | all children | all children            |

    Scenario: Granted Location for Admin role
        When school admin creates a user group with a draft granted permission
        And school admin selects "School Admin" for granted role
        Then school admin sees granted location is auto fill organization
        And school admin is unable to edit location

    @ignore
    Scenario: Add granted location with archived location
        Given And school admin has archived "location L1"
        When school admin creates a user group with a draft granted permission
        And school admin selects granted location
        Then school admin does not sees "location L1" is displayed on location popup