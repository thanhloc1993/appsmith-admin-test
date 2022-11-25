@cms @cms2
@timesheet
@transportation-expense

Feature: Teacher can create timesheet with transportation expense

    Scenario: Teacher can create timesheet with all fields
        # required fields of general info, other working hours, transportation expenses, remarks
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "teacher" logins CMS
        And "teacher" goes to timesheet management page
        When "teacher" opens create timesheet page
        And "teacher" fills in general info section
        And "teacher" adds "2" rows in other working hours section
            | workingType | startTime | endTime |
            | Office      | 9:00      | 10:00   |
            | Other       | 10:00     | 11:00   |
        And "teacher" adds "2" rows in transportation expenses section
            | transportationType | from   | to     | amount | roundTrip |
            | Bus                | Home   | Office | 100    | Yes       |
            | Others             | Office | Home   | 100    | No        |
        And "teacher" fills in remarks section
        And "teacher" saves the timesheet
        Then "teacher" is redirected to "Timesheet Detail" page
        And "teacher" sees message "You have created the timesheet successfully!"
        And "teacher" sees newly created timesheet with correct information
