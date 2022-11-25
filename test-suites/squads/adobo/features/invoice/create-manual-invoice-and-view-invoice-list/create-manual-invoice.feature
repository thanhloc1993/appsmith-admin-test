@ignore
@invoice @adobo
@create-manual-invoice
@staging
@cms

Feature: Create invoice via Student Detail page
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Admin creates an invoice for billing items with <status> status
        Given "school admin" has created a "student" record
        And "school admin" has added a billing item with "<status>" status for the "student"
        When "school admin" creates an invoice record for the "student"
        Then "school admin" sees new invoice has been created
        And "school admin" sees status of new invoice is "Draft"
        Examples:
            | status  |
            | Pending |
            | Billed  |

    Scenario: Admin cannot create an invoice without selecting billing items
        Given "school admin" has created a "student" record
        When "school admin" attempts to create an invoice for the "student"
        Then "school admin" sees save button disabled

    Scenario: Admin cancels creation of invoice
        Given "school admin" has created a "student" record
        And "school admin" has added a billing item with "Pending" status for the "student"
        And "school admin" attempts to create an invoice for the "student"
        When "school admin" cancels creation of invoice
        Then "school admin" sees invoice list of the "student"

    Scenario Outline: Admin cannot create an invoice for student due to no billing items with applicable status
        Given "school admin" has created a "student" record
        And "school admin" has added a billing item with "<status>" status for the "student"
        When "school admin" attempts to create an invoice for the "student"
        Then "school admin" sees no billing items in the modal
        Examples:
            | status    |
            | Cancelled |
            | Invoiced  |
