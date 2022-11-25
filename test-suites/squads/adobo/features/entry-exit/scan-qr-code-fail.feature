@cms @learner
@entry-exit @adobo
@ignore

Feature: Scan QR Code fail
    Background:
        Given "school admin" logins CMS

    Scenario: Student with QUIT status scan QR fail
        When school admin creates a student with quit status
        And "student" logins Learner App
        And student uses QR code on learner app to scan
        Then school admin sees scanner scan fail

    Scenario Outline: Scan QR fail after editing student status to QUIT
        When school admin creates a student with "<status>" status
        And school admin edits status of created student to quit
        And "student" logins learner app
        And student uses QR code on learner app to scan
        Then school admin sees scanner scan fail
        Examples:
            | status    |
            | Potential |
            | Enrolled  |
