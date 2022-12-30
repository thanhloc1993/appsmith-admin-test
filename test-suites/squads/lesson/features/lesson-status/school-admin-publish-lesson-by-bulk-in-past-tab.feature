@cms
@lesson
@lesson-status
@ignore

Feature: School Admin can/cannot publish lesson by bulk in past lessons tab
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can publish lessons as Draft by bulk in past lessons tab
        Given "school admin" has created a "Draft" "<recurring_type>" "<method>" lesson in the "past" with all required fields
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to "past" lessons list page
        And "school admin" has selected the "Draft" "<recurring_type>" "<method>" lesson by checkbox
        When "school admin" clicks three dots icon
        And "school Admin" publishes lesson
        And "school admin" "<action>" to bulk update lesson
        Then "school admin" is still in the "past" lesson management page
        And "school admin" sees successfully message
        And "school admin" sees selected lesson's status is "<expect_status>"
        Examples:
            | action   | recurring_type   | method     | expect_status |
            | confirms | one time         | individual | Published     |
            | confirms | weekly recurring | group      | Published     |
            | cancels  | one time         | group      | Draft         |
            | cancels  | weekly recurring | individual | Draft         |

    Scenario Outline: School Admin cannot publish lesson that has a different status Draft by bulk in past lesson tab
        Given "school admin" has created a "<status>" "<recurring_type>" "<method>" lesson in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to "past" lessons list page
        And "school admin" has selected the "<status>" "<recurring_type>" "<method>" lesson by checkbox
        When "school admin" clicks three dots icon
        And "school Admin" publishes lesson
        And "school admin" "confirms" to bulk update lesson
        Then "school admin" is still in the "past" lesson management page
        And "school admin" sees successfully message
        And "school admin" sees lesson's status no change
        Examples:
            | status    | recurring_type   | method     |
            | Published | one time         | individual |
            | Completed | weekly recurring | group      |
            | Cancelled | one time         | group      |

    Scenario Outline: School Admin cannot publish lesson by bulk if missing required in past lessons tab
        Given "school admin" has created a "Draft" "<recurring_type>" "<method>" lesson in the "past" with missing required fields
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to "past" lessons list page
        And "school admin" has selected the "Draft" "<recurring_type>" "<method>" lesson by checkbox
        When "school admin" clicks three dots icon
        And "school Admin" publishes lesson
        And "school admin" "confirms" to bulk update lesson
        Then "school admin" is still in the "past" lesson management page
        And "school admin" sees successfully message
        And "school admin" sees lesson's status no change
        Examples:
            | recurring_type   | method     |
            | one time         | individual |
            | weekly recurring | group      |
