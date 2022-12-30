@cms
@lesson
@lesson-status
@ignore

Feature: School Admin can/cannot cancel lesson by bulk in past lessons tab
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can cancel lesson by bulk in past lessons tab
        Given "school admin" has created a "<status>" "<recurring_settings>" "<teaching_method>" lesson in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to "past" lessons list page
        And "school admin" has selected the "<status>" "<recurring_settings>" "<teaching_method>" lesson by checkbox
        When "school admin" clicks three dots icon
        And "school Admin" cancels lesson
        And "school admin" "confirms" to cancel lesson
        Then "school admin" is still in the "past" lesson management page
        And "school admin" sees successfully message
        And "school admin" sees selected lesson's status is "Cancelled"
        Examples:
            | status    | recurring_settings | teaching_method |
            | completed | one time           | individual      |
            | completed | weekly recurring   | group           |
            | published | one time           | group           |
            | published | weekly recurring   | individual      |

    Scenario Outline: School Admin cannot cancel lesson by bulk in past lessons tab
        Given "school admin" has created a "<status>" "<recurring_settings>" "<lesson_type>" lesson in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to "past" lessons list page
        And "school admin" has selected the "<status>" "<recurring_settings>" "<lesson_type>" lesson by checkbox
        When "school admin" clicks three dots icon
        And "school Admin" cancels lesson
        And "school admin" "confirms" to cancel lesson
        Then "school admin" still in lesson management page
        And "school admin" sees successfully message
        And "school admin" sees selected lesson's status no change
        Examples:
            | status    | recurring_settings | lesson_type |
            | draft     | one-time           | individual  |
            | cancelled | weekly recurring   | group       |

    Scenario Outline: School Admin cannot cancel locked lesson by bulk in past lessons tab
        Given "school admin" has created a "<status>" "<recurring_settings>" "<lesson_type>" lesson in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to "past" lessons list page
        And "school admin" has locked the "<status>" "<recurring_settings>" "<lesson_type>" lesson
        And "school admin" has selected the "<status>" "<recurring_settings>" "<lesson_type>" lesson by checkbox
        When "school admin" clicks three dots icon
        And "school Admin" cancels lesson
        And "school admin" "confirms" to cancel lesson
        Then "school admin" is still in the "past" lesson management page
        And "school admin" sees successfully message
        And "school admin" sees selected lesson's status no change
        Examples:
            | status    | recurring_settings | lesson_type |
            | completed | one-time           | individual  |
            | completed | weekly recurring   | group       |
