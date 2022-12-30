@cms
@lesson
@course
@ignore

Feature: School admin can select parent location and view location in location popup
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has opened creating course page
        And "school admin" has filled course name
        And "school admin" has opened location popup

    Scenario: School admin can select parent location in location popup
        When "school admin" selects parent location in location popup
        Then "school admin" sees parent location is in checked mode
        And "school admin" sees all children location of parent location is in checked mode
        And "school admin" sees all children location of parent location in selected field
        And "school admin" does not see parent location in selected field

    Scenario: School admin can view selected all children location of parent location in location field
        Given "school admin" has selected parent location in location popup
        When "school admin" saves selected location in location popup
        Then "school admin" sees all children location of parent location in location field
        And "school admin" does not see parent location in location field

    Scenario: School admin can view selected all children location of parent location in detail course page
        Given "school admin" has selected parent location in location popup
        And "school admin" has saved selected location in location popup
        When "school admin" creates course
        And "school admin" goes to detail course page under setting tab
        Then "school admin" sees all children location of parent location in location field
        And "school admin" does not see parent location in location field
