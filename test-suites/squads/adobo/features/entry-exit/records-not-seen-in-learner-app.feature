@cms @learner @parent
@entry-exit @adobo
@staging

Feature: Student and parent do not see entry and exit records in learner app
    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student" with "Enrolled" status and parent info
        And "student" logins Learner App

    Scenario: Student and parent do not see entry & exit records when student app is first launched
        When "parent P1" of "student" logins Learner App
        And "student" and "parent" view entry & exit information
        Then "student" and "parent" see that there are no entry and exit records

    Scenario: Student not see entry & exit record when admin remove all student record
        When "student" scans QR code successfully the "first" time
        And "school admin" deletes the selected entry & exit record of "student"
        And "parent P1" of "student" logins Learner App
        And "student" and "parent" view entry & exit information
        Then "student" and "parent" see that there are no entry and exit records

    Scenario: Parent not see entry & exit record of student when admin remove their relationship
        When "student" scans QR code successfully the "first" time
        And school admin removes relationship between "parent" and "student"
        And "parent P1" of "student" logins Learner App
        And "parent" views entry & exit information of "student"
        Then "parent" does not see entry & exit record of "student"
