@cms @teacher @learner @user @login @ignore
Feature: Login successfully after login fail

    @blocker
    Scenario Outline: Login success with correct username and password after login fail
        Given "<user>" logins failed on "<platform>"
        When "<user>" logins with correct username and password on "<platform>"
        Then "<user>" logins successfully

        Examples:
            | user         | platform    |
            | student      | Learner App |
            | parent       | Learner App |
            | teacher      | Teacher App |
            | school admin | CMS         |
            | teacher      | CMS         |
