@cms @teacher
@entry-exit @adobo
@ignore

Feature: Opens QR Code Scanner screen on a new browser tab

    Scenario: Teacher can open QR Code Scanner screen on a new browser tab
        Given "teacher" logins on CMS
        When "teacher" selects the "QR Code Scanner" on the left-side menu
        Then "teacher" sees QR Code Scanner screen on a new browser tab