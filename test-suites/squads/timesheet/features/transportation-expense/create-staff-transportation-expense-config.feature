@cms
@timesheet
@transportation-expense

Feature: Add value into Transportation expense table

    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor

    Scenario: Add values into transportation expense table
        Given "school admin" goes to staff timesheet setting tab for requestor
        When "school admin" opens edit staff transportation expense modal
        And "school admin" adds 1 row on staff transportation expense table
        And "school admin" fills in required fields on staff transportation expense table row with valid data
        And "school admin" adds 1 row on staff transportation expense table
        And "school admin" fills in required fields on staff transportation expense table row with valid data
        And "school admin" saves staff transportation expense data
        Then "school admin" sees message "You have edited transportation expense info successfully."
        And "school admin" sees staff transportation expense table updated with new rows

    @cms2
    Scenario: Add values into transportation expense table simultaneously
        Given "school admin 2" logins CMS
        And "school admin" goes to staff timesheet setting tab for requestor
        And "school admin 2" goes to staff timesheet setting tab for requestor
        When "school admin" adds and saves 2 rows on staff transportation expense table
        And "school admin 2" adds and saves 2 rows on staff transportation expense table
        And "school admin" adds and saves 2 rows on staff transportation expense table
        And "school admin 2" reloads timesheet setting tab
        Then school admin and school admin 2 sees 4 rows on staff transportation expense table
        And "school admin" sees staff transportation expense table updated with new rows
        And "school admin 2" sees staff transportation expense table updated with new rows saved by school admin
