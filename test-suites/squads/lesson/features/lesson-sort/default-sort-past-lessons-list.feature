@cms @learner @learner2
@lesson
@lesson-sort
@ignore

Feature: Default sort past lessons list
    Background:
        Given "school admin" logins CMS
        And "student S1" with course and enrolled status has logged Learner App
        And "student S2" with course and enrolled status has logged Learner App
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: Sort lesson by start time if start time different
        Given "school admin" has filled start date is "yesterday" & time from "23:00" to "23:15"
        And "school admin" has added "student S1"
        And "school admin" has created the "lesson L1" of lesson management
        And "school admin" has opened creating lesson page
        And "school admin" has filled start date is "yesterday" & time from "23:15" to "23:30"
        And "school admin" has added "student S1"
        And "school admin" has created the "lesson L2" of lesson management
        When "school admin" searches name of "student S1" for the keyword
        Then "school admin" sees "lesson L2" above "lesson L1" in "past" lessons list

    Scenario: Sort lesson by end time if start time is the same
        Given "school admin" has filled start date is "yesterday" & time from "23:00" to "23:15"
        And "school admin" has added "student S2"
        And "school admin" has created the "lesson L1" of lesson management
        And "school admin" has opened creating lesson page
        And "school admin" has filled start date is "yesterday" & time from "23:00" to "23:30"
        And "school admin" has added "student S2"
        And "school admin" has created the "lesson L2" of lesson management
        When "school admin" searches name of "student S2" for the keyword
        Then "school admin" sees "lesson L2" above "lesson L1" in "past" lessons list
