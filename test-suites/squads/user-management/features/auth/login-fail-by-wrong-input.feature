@cms @teacher @learner
@user @login
Feature: Login fail by wrong input

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with parent info
        And school admin has created a staff
        And school admin has logged out CMS

    Scenario Outline: Login fail when leaves the username blank
        When user logins "<withoutType>" username on "<platform>"
        Then user logins failed on "<platform>"
        Examples:
            | platform    | withoutType         |
            | Learner App | 1 of [blank, space] |
            | Teacher App | 1 of [blank, space] |
            | CMS         | 1 of [blank, space] |

    Scenario Outline: Login fail when leaves the password blank
        When user logins "<withoutType>" password on "<platform>"
        Then user logins failed on "<platform>"
        Examples:
            | platform    | withoutType         |
            | Learner App | 1 of [blank, space] |
            | Teacher App | 1 of [blank, space] |
            | CMS         | 1 of [blank, space] |

    Scenario Outline: Login fail when leaves the username and password blank
        When user logins "<withoutType>" username and password on "<platform>"
        Then user logins failed on "<platform>"
        Examples:
            | platform    | withoutType         |
            | Learner App | 1 of [blank, space] |
            | Teacher App | 1 of [blank, space] |
            | CMS         | 1 of [blank, space] |