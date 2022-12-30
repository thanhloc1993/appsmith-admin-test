@cms
@calendar
@ignore
@calendar-daily-view

Feature: School admin can view draft one time individual or group lessons created on calendar daily view
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to Calendar tab

    Scenario: School admin can view draft one time individual lesson created on calendar daily view
        Given "school admin" has saved draft an one time "individual" lesson with lesson date in today and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" switches to daily view
        Then "School admin" sees lesson item with blue outlined is displayed exactly at the time and weekday in calendar
        And "School admin" sees "(No Student)" & lesson start & end time in lesson item

    Scenario: School admin can view draft one time group lesson created on calendar daily view
        Given "school admin" has saved draft an one time "group" lesson with lesson date in today and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" switches to daily view
        Then "School admin" sees lesson item with blue outlined is displayed exactly at the time and weekday in calendar
        And "School admin" sees "(No Course) (No Class)" & lesson start & end time in lesson item