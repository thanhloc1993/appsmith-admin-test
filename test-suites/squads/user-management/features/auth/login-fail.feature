@cms
@user @login
Feature: Login fail with another platform account

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with parent info
        And school admin has created a staff
        And school admin has logged out CMS

    @learner
    Scenario Outline: Login Learner App fail
        When user logins by "<userAccount>" account on Learner App
        Then user logins failed on Learner App
        Examples:
            | userAccount  |
            | teacher      |
            | school admin |

    @teacher
    Scenario Outline: Login Teacher App fail
        When user logins by "<userAccount>" account on Teacher App
        Then user logins failed on Teacher App
        Examples:
            | userAccount  |
            | student      |
            | parent P1    |
            | school admin |

    Scenario Outline: Login CMS fail
        When user logins by "<userAccount>" account on CMS
        Then user logins failed on CMS
        Examples:
            | userAccount |
            | student     |
            | parent P1   |