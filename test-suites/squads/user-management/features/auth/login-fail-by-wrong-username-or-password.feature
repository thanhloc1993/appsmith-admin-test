@cms @teacher @learner
@user @login

Feature: Login fail by wrong username or wrong password

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with parent info
        And school admin has created a staff
        And school admin has logged out CMS

    Scenario Outline: Login fail when inputs wrong username
        When user logins with wrong username on "<platform>"
        Then user logins failed on "<platform>"
        Examples:
            | platform    |
            | Learner App |
            | Teacher App |
            | CMS         |

    Scenario Outline: Login fail when inputs wrong password
        When user logins with wrong password on "<platform>"
        Then user logins failed on "<platform>"
        Examples:
            | platform    |
            | Learner App |
            | Teacher App |
            | CMS         |

    Scenario Outline: Login fail when inputs non-existed or invalid username on system
        When user logins with "<inputType>" username on "<platform>"
        Then user logins failed on "<platform>"
        Examples:
            | inputType                   | platform    |
            | 1 of [non-existed, invalid] | Learner App |
            | 1 of [non-existed, invalid] | Teacher App |
            | 1 of [non-existed, invalid] | CMS         |