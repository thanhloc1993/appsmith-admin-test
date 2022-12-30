@cms
@calendar
@calendar-weekly-view

Feature: School admin can delete published one-time individual lesson in lesson drawer
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to Calendar tab

    Scenario: School admin can delete published one-time individual lesson in lesson drawer
        Given "school admin" has created an one time "individual" lesson with lesson date of today and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" deletes lesson
        Then "school admin" does not see previous opened lesson drawer
        And "school admin" does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar

    Scenario: School admin can delete published one-time group lesson in lesson drawer
        Given "school admin" has created an one time "group" lesson with lesson date of today and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" deletes lesson
        Then "school admin" does not see previous opened lesson drawer
        And "school admin" does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar

    Scenario: School admin cancel delete published one-time individual lesson in lesson drawer
        Given "school admin" has created an one time "individual" lesson with lesson date of today and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" cancels deleting lesson
        Then "school admin" still sees previous opened lesson drawer
        And "school admin" still sees lesson item with blue filled is displayed exactly at the time and weekday in calendar

    Scenario: School admin cancel delete published one-time group lesson in lesson drawer
        Given "school admin" has created an one time "group" lesson with lesson date of today and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" cancels deleting lesson
        Then "school admin" still sees previous opened lesson drawer
        And "school admin" still sees lesson item with blue filled is displayed exactly at the time and weekday in calendar