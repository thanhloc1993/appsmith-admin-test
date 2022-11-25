@cms @learner
@entry-exit @adobo
@ignore

Feature: Scan QR Code successfully
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Student with <status> status scan QR successfully
        When school admin creates a student with "<status>" status
        And "student" logins Learner App
        And student uses QR code on Learner App to scan
        Then school admin sees scanner scan successfully
        Examples:
            | status    |
            | Potential |
            | Enrolled  |

    Scenario Outline: Scan QR successfully after editing student status to <newStatus>
        When school admin creates a student with "<status>" status
        And school admin edits status of created student to "<newStatus>"
        And "student" logins Learner App
        And student uses QR code on Learner App to scan
        Then school admin sees scanner scan successfully
        Examples:
            | status    | newStatus |
            | Potential | Enrolled  |
            | Enrolled  | Potential |
            | Quit      | Potential |
            | Quit      | Enrolled  |
