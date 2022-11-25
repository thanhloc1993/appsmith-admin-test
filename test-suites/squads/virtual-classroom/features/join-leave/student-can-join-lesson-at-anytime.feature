@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Student can join lesson at anytime
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has applied center location in location settings on Teacher App

    Scenario: Student can join lesson at anytime even before 10 minutes with the start time
        Given school admin has created a lesson management with start date&time is more than 10 minutes from now
        When "student" goes to lesson tab on Learner App
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is over 24 hours
        Given school admin has created a lesson of lesson management that has been completed over 24 hours
        When "student" goes to lesson tab on Learner App
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is in the next week
        Given school admin has created a lesson management with start date&time is in the next week
        When "student" goes to lesson tab on Learner App
        And "student" opens calendar on Learner App
        And "student" selects respective lesson date on the calendar
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is in the last week
        Given school admin has created a lesson management with start date&time is in the last week
        When "student" goes to lesson tab on Learner App
        And "student" opens calendar on Learner App
        And "student" selects respective lesson date on the calendar
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is in the next month
        Given school admin has created a lesson management with start date&time is in the next month
        When "student" goes to lesson tab on Learner App
        And "student" opens calendar on Learner App
        And "student" selects respective lesson date on the calendar
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is in the last month
        Given school admin has created a lesson management with start date&time is in the previous month
        When "student" goes to lesson tab on Learner App
        And "student" opens calendar on Learner App
        And "student" selects respective lesson date on the calendar
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is in the next year
        Given school admin has created a lesson management with start date&time is in the next year
        When "student" goes to lesson tab on Learner App
        And "student" opens calendar on Learner App
        And "student" selects respective lesson date on the calendar
        Then "student" can join lesson on Learner App

    Scenario: Student can join lesson at anytime even lesson date&time is in the last year
        Given school admin has created a lesson management with start date&time is in the last year
        When "student" goes to lesson tab on Learner App
        And "student" opens calendar on Learner App
        And "student" selects respective lesson date on the calendar
        Then "student" can join lesson on Learner App