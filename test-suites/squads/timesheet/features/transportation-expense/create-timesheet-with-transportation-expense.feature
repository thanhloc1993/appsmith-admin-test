@cms
@timesheet
@transportation-expense

Feature: School admin can create timesheet with transportation expense

    Scenario: School admin can create timesheet with all fields
        # required fields of general info, other working hours, transportation expenses, remarks
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" goes to timesheet management page
        When "school admin" opens create timesheet page
        And "school admin" fills in general info section
        And "school admin" adds "2" rows in other working hours section
            | workingType | startTime | endTime |
            | Office      | 9:00      | 10:00   |
            | Other       | 10:00     | 11:00   |
        And "school admin" adds "2" rows in transportation expenses section
            | transportationType | from   | to     | amount | roundTrip |
            | Train              | Home   | Office | 100    | Yes       |
            | Bus                | Office | Home   | 100    | No        |
        And "school admin" fills in remarks section
        And "school admin" saves the timesheet
        Then "school admin" is redirected to "Timesheet Detail" page
        And "school admin" sees message "You have created the timesheet successfully!"
        And "school admin" sees newly created timesheet with correct information
