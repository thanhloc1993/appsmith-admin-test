@cms
@entry-exit @adobo
@ignore

Feature: School admin prints QR code sheet successfully
    Background:
        Given "school admin" logins CMS

    Scenario: School admin prints QR code sheet
        When school admin creates a student on CMS
        And school admin selects print QR code sheet for created student
        And school admin selects print PDF
        Then school admin sees PDF file has been printed