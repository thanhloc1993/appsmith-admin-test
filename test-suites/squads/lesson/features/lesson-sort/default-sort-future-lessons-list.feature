@cms @learner @learner2
@lesson
@lesson-sort
@ignore

Feature: Default sort future lessons list
    Background:
        Given "school admin" logins CMS
        And "student S1" with course and enrolled status has logged Learner App
        And "student S2" with course and enrolled status has logged Learner App
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: Sort lesson by start time if start time different
        Given "school admin" has filled start date is "today" & time from "07:00" to "07:15"
        And "school admin" has added "student S1"
        And "school admin" has created the "lesson L1" of lesson management
        And "school admin" has opened creating lesson page
        And "school admin" has filled start date is "today" & time from "07:15" to "07:30"
        And "school admin" has added "student S1"
        And "school admin" has created the "lesson L2" of lesson management
        When "school admin" searches name of "student S1" for the keyword
        Then "school admin" sees "lesson L1" above "lesson L2" in "future" lessons list

    Scenario: Sort lesson by end time if start time is the same
        Given "school admin" has filled start date is "today" & time from "09:00" to "09:15"
        And "school admin" has added "student S2"
        And "school admin" has created the "lesson L1" of lesson management
        And "school admin" has opened creating lesson page
        And "school admin" has filled start date is "today" & time from "09:00" to "09:30"
        And "school admin" has added "student S2"
        And "school admin" has created the "lesson L2" of lesson management
        When "school admin" searches name of "student S2" for the keyword
        Then "school admin" sees "lesson L1" above "lesson L2" in "future" lessons list
