@cms
@entry-exit
@ignore

Feature: School admin downloads QR code sheet successfully
    Background:
        Given "school admin" logins CMS

    Scenario: School admin downloads student card for existing students successfully
        When school admin creates a student on CMS
        And school admin selects print QR code sheet for created student
        And school admin selects download PDF
        Then school admin sees PDF file has been downloaded successfully