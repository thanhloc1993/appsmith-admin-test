@cms @learner @parent
@entry-exit @adobo
@ignore

Feature: Record entry and exit time in learner app

    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student" with "Enrolled" status and parent info
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App

    Scenario: Record is saved as entry time
        When "student" scans QR code successfully the "first" time
        Then "student" and "parent" see "Entry" time is recorded for student
        And "student" and "parent" see no exit time displayed

    Scenario: Record is saved as exit time
        When "student" scans QR code successfully the "second" time
        Then "student" and "parent" see "Exit" time is recorded for student

    Scenario: New entry record is saved for student
        When "student" scans QR code successfully the "third" time
        Then "student" and "parent" see "Entry" time is recorded for student
        And "student" and "parent" see no exit time displayed

    Scenario: New exit record is saved for student
        When "student" scans QR code successfully the "fourth" time
        Then "student" and "parent" see "Exit" time is recorded for student

    Scenario: New entry record is saved for student in case School admin delete the latest record
        When "student" scans QR code successfully the "first" time
        And "school admin" deletes the selected entry & exit record of "student"
        And "student" scans QR code successfully the second time
        Then "student" and "parent" see "Entry" time is recorded for student
        And "student" and "parent" see no exit time displayed

    Scenario: New entry record is saved for student in case they not scan to exit before
        When student scans QR code successfully the "first" time
        And school admin edits exit time for student
        And student scans QR code successfully the "second" time
        Then student and parent see entry time is saved for student
        And student and parent see no exit time displayed

    Scenario: New exit record is saved for student in case they not scan to entry before
        When "school admin" adds new entry record for "student"
        And student scans QR code successfully the "first" time
        Then student and parent see exit time is recorded for the student

    Scenario: New entry record is saved for student in case they scan the first time at the new day
        When student scans QR code successfully the "first" time during the "current" day
        And student scans QR code successfully the "first" time during the "next" day
        Then student and parent see 2 records with the same entry time
        And student and parent see 2 records with no exit time displayed
