@cms
@calendar
@calendar-weekly-view
@staging

Feature: School admin can view draft one time lessons on calendar weekly view
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to Calendar tab

    Scenario: School admin can view draft one time individual lesson on calendar weekly view
        Given "school admin" has saved draft an one time "individual" lesson with lesson date of today and "location L1" by Add button
        When "school admin" chooses "Center" as location type
        And "school admin" chooses "location L1" as previous lesson location in location list
        Then "school admin" sees "Weekly" view is selected
        And "school admin" sees current weekly date in weekly view
        And "school admin" sees today's date with grey outlined circle
        And "school admin" sees day time from 00:00 to 23:00
        And "School admin" sees lesson is displayed in today cell with light blue outline

    Scenario: School admin can view draft one time group lesson on calendar weekly view
        Given "school admin" has saved draft an one time "group" lesson with lesson date of today and "location L1" by Add button
        When "school admin" chooses "Center" as location type
        And "school admin" chooses "location L1" as previous lesson location in location list
        Then "school admin" sees "Weekly" view is selected
        And "school admin" sees day time from 00:00 to 23:00
        And "School admin" sees lesson is displayed in today cell with light blue outline