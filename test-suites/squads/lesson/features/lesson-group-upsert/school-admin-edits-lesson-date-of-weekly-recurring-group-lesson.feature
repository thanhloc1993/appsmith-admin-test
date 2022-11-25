@cms
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin edits lesson date of weekly recurring group lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School admin can edit lesson date of a <status> lesson with "This and the following lessons"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "future"
        And "school admin" has opened editing lesson page
        When "school admin" edits lesson date with "<value>"
        And "school admin" saves the changes with "This and the following lessons" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson date for this "<status>" lesson
        And "school admin" sees other "<status>" lessons in chain from edited lesson has lesson date added 7 days
        And "school admin" sees other "<status>" lessons in chain from edited lesson has weekly on is day of week of edited lesson
        And "school admin" sees other "<status>" lessons in chain from edited lesson remaining end date
        And "school admin" sees "<status>" lessons in chain before edited lesson has end date is lesson date of previous lesson
        And "school admin" sees other "<status>" lessons in chain before edited lesson remaining lesson date and weekly on
        Examples:
            | status    | value                                 |
            | Draft     | current date < lesson date < End date |
            | Published | current date > lesson date < End date |

    Scenario Outline: School admin can edit lesson date = end date a <status> lesson with "This and the following lessons"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "future"
        And "school admin" has opened editing lesson page
        When "school admin" edits lesson date with "lesson date = end date"
        And "school admin" saves the changes with "This and the following lessons" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson date for this "<status>" lesson
        And "school admin" sees other "<status>" lessons in chain from edited lesson had removed in the "future"
        And "school admin" sees "<status>" lessons in chain before edited lesson has end date is lesson date of previous lesson
        And "school admin" sees other "<status>" lessons in chain before edited lesson remaining lesson date and weekly on
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can edit lesson date of a <status> lesson with "Only this Lesson"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "past"
        And "school admin" has opened editing lesson page
        When "school admin" edits lesson date with "<value>"
        And "school admin" saves the changes with "Only this Lesson" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson date for this "<status>" lesson
        And "school admin" sees other "<status>" lessons in chain no update in the "past"
        Examples:
            | status    | value                                 |
            | Draft     | current date < lesson date < End date |
            | Published | current date > lesson date < End date |
            | Published | lesson date = end date                |
            