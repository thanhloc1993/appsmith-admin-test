@cms @learner
@entry-exit @adobo
@ignore

Feature: Scan QR Code fail with another cases
    Background:
        Given "school admin" logins CMS
        And school admin has created a student with "Enrolled" status
        And "student" logins Learner App

    Scenario: Student fails to scan invalid QR code
        When student scans invalid QR code
        Then school admin sees message "There is something wrong with your QR code"

    Scenario: Student scans QR code without internet connection
        When student scans without an internet connection
        Then school admin sees message "Please try again, you're network is down"

    Scenario: Student scans again within 1 minute
        When student uses QR code on Learner App to scan
        And school admin sees scanner scan successfully
        And student scans again after 5 seconds
        Then school admin sees message "Please wait for 1 minute to scan again"