@cms
@calendar
@calendar-weekly-view

Feature: School admin can delete published individual or group recurring lesson in lesson drawer
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to Calendar tab

    Scenario: School admin can delete published recurring group lesson with option "this lesson only"
        Given "school admin" has created recurring "group" lesson with lesson date in the future and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" deletes lesson with option "this lesson only"
        And "school admin" does not see previous opened lesson drawer
        And "school admin" does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar
        And "school admin" still sees other lessons in the chain with blue filled in calendar

    Scenario: School admin can delete published recurring group lesson with option "this and following lesson"
        Given "school admin" has created recurring "group" lesson with lesson date in the future and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" deletes lesson with option "this and following lesson"
        And "school admin" does not see previous opened lesson drawer
        And "school admin" does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar
        And "school admin" does not see other lessons in the chain with blue filled in calendar

    Scenario: School admin can delete published recurring individual lesson with option "this lesson only"
        Given "school admin" has created recurring "individual" lesson with lesson date in the future and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" deletes lesson with option "this lesson only"
        And "school admin" does not see previous opened lesson drawer
        And "school admin" does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar
        And "school admin" still sees other lessons in the chain with blue filled in calendar

    Scenario: School admin can delete published recurring individual lesson with option "this and following lesson"
        Given "school admin" has created recurring "individual" lesson with lesson date in the future and "location L1" by Add button
        And "school admin" has chosen "Center" as location type
        And "school admin" has chosen "location L1" as previous lesson location in location list
        When "school admin" opens lessons drawer
        And "school admin" deletes lesson with option "this and following lesson"
        And "school admin" does not see previous opened lesson drawer
        And "school admin" does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar
        And "school admin" does not see other lessons in the chain with blue filled in calendar
