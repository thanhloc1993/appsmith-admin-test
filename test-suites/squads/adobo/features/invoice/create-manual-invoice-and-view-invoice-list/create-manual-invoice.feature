@ignore
@invoice @adobo
@create-manual-invoice
@staging
@cms

Feature: Create invoice via Student Detail page
    Background:
        Given "school admin" logins CMS

    #@blocker
    Scenario Outline: Admin creates an invoice using billing items with "<status>" status
        Given "school admin" has created a "student" record
        And "school admin" has added a billing item with "<status>" status
        When "school admin" has created an invoice for "student"
        Then "school admin" sees invoice has been created successfully
        And "school admin" sees invoice status equals "Draft"
        Examples:
            | status  |
            | Pending |
            | Billed  |

    #@blocker
    Scenario: Admin creates invoice using multiple billing items
        Given "school admin" has created a "student" record
        And "school admin" has added a billing item with "Pending" status
        And "school admin" has added a billing item with "Billed" status
        When "school admin" has created an invoice for "student"
        Then "school admin" sees invoice has been created successfully
        And "school admin" sees invoice status equals "Draft"

    #@blocker
    Scenario: Display tax value for multiple billing items
        Given "school admin" has created a "student" record
        And "school admin" has added a billing item with "5"% tax
        And "school admin" has added a billing item with "5"% tax
        And "school admin" has added a billing item with "10"% tax
        And "school admin" has added a billing item with "10"% tax
        And "school admin" has added a billing item with "0"% tax
        When "school admin" has created an invoice for "student"
        Then "school admin" sees invoice correctly displays two tax groups
        And each tax group displays the correct amount

# Scenario: Admin cannot create an invoice without selecting billing items
#     Given "school admin" has created a "student" record
#     When "school admin" attempts to create an invoice
#     Then "school admin" sees save button disabled

# Scenario Outline: Admin cannot create invoice using billing items with "<status>" status
#     Given "school admin" has created a "student" record
#     And "school admin" has added a billing item with "<status>" status
#     When "school admin" attempts to create an invoice
#     Then "school admin" sees no billing items in the modal
#     Examples:
#         | status    |
#         | Cancelled |
#         | Invoiced  |

# Scenario: Admin views the invoice management page
#     When "school admin" navigates to invoice management page
#     Then "school admin" sees the invoice management page
#     And "school admin" sees invoices are sorted correctly

# Scenario: Admin can only view invoices related to a student inside student record
#     Given "school admin" has created a "student A" record
#     And "school admin" has created an invoice for "student A"
#     And "school admin" has created a "student B" record
#     And "school admin" has created an invoice for "student B"
#     When "school admin" navigates to invoice list inside "student A" record
#     Then "school admin" cannot see invoice record of "student B"

# Scenario: Cannot display tax group for billing item without tax
#     Given "school admin" has created a "student" record
#     And "school admin" has added a billing item with "0"% tax
#     When "school admin" has created an invoice for "student"
#     Then "school admin" sees invoice does not display tax group
