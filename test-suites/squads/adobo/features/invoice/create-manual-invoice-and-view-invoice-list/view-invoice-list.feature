@ignore
@invoice @adobo
@view-invoice-list
@staging
@cms

Feature: View invoice list
    Background:
        Given "school admin" logins CMS

    Scenario: Admin views the invoice management page
        When "school admin" navigates to the invoice management page
        Then "school admin" sees the invoice management page
    # 'Then' step should check for the columns (e.g. Invoice no., Status, Student Name, etc.) inside the page to ensure it is not a blank page

    Scenario: Admin views the invoice tab inside a student record
        Given "school admin" has created a "student" record
        When "school admin" navigates to the invoice tab of the "student" record
        Then "school admin" sees invoice list of the "student"
