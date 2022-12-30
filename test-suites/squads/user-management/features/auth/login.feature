@cms
@user @login
Feature: Login success on all platforms

    Background:
        Given "school admin" logins CMS

    @learner
    Scenario Outline: Login Learner App success
        Given school admin has created a student with parent info
        When user logins by "<userRole>" account on Learner App
        Then user logins "success" on Learner App
        Examples:
            | userRole |
            | Student  |
            | Parent   |

    @teacher
    Scenario Outline: Login Teacher App success
        Given school admin has created a user group with role "<userRole>"
        And school admin has created staff with user group "<userRole>"
        When user logins by "<userRole>" account on Teacher App
        Then user logins "success" on Teacher App
        Examples:
            | userRole |
            | Teacher  |
    # ### Cannot re issue password for another roles
    ### Find another way before enable these examples
    # | School Admin |
    # | Teacher Lead |
    # | Centre Staff |
    # | Centre Lead    |
    # | Centre Manager |
    # | HQ Staff       |

    Scenario Outline: Login CMS success
        Given school admin has created a user group with role "<userRole>"
        And school admin has created staff with user group "<userRole>"
        And school admin has logged out CMS
        When user logins by "<userRole>" account on CMS
        Then user logins "success" on CMS
        Examples:
            | userRole |
            | Teacher  |
# | School Admin   |
# | Teacher Lead   |
# | Centre Staff   |
# | Centre Lead    |
# | Centre Manager |
# | HQ Staff       |