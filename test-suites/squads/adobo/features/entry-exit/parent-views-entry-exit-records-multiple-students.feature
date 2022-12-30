@cms @learner @parent
@entry-exit @adobo
@staging

Feature: Parent views entry & exit records of multiple students
    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student S1" with "Enrolled" status and parent info
        And school admin has created "student S2" with "Enrolled" status and parent of "student S1"
        And "student S1, student S2" has at least 1 entry & exit record
        And "parent P1" of "student S1" logins Learner App

    Scenario: Show exact record for parent when they switch their child
        When "parent P1" views entry & exit record of "student S1"
        And "parent P1" sees entry & exit record of "student S1"
        And "parent P1" switches to "student S2" to view entry & exit record
        Then "parent P1" sees entry & exit record of the other student "student S2"
