@cms
@lesson
@lesson-group-upsert

Feature: School Admin edits student and teacher of the weekly recurring group lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin removes Teacher and Student of a <status> group lesson with "This and the following lessons"
        Given "school admin" has created a "<status>" "future" "Weekly Recurring" group lesson with teachers and students
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has opened editing lesson page
        When "school admin" removes "teacher T2" and "student S2" to the lesson
        And "school admin" clicks save the changes with "<status>" "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "teacher T2" in lesson detail page on CMS
        And "school admin" can "not see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "not see" "teacher T2" & "student S2" in other "<status>" lessons in chain "after" the edited lesson
        And "school admin" can "see" "teacher T2" & "student S2" in other "<status>" lessons in chain "before" the edited lesson
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin removes Teacher and Student of a <status> group lesson with "Only this Lesson"
        Given "school admin" has created a "<status>" "future" "Weekly Recurring" group lesson with teachers and students
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has opened editing lesson page
        When "school admin" removes "teacher T2" and "student S2" to the lesson
        And "school admin" clicks save the changes with "<status>" "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "teacher T2" in lesson detail page on CMS
        And "school admin" can "not see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "see" "teacher T2" & "student S2" in other "<status>" lessons in chain "before" the edited lesson
        And "school admin" can "see" "teacher T2" & "student S2" in other "<status>" lessons in chain "after" the edited lesson
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin adds Teacher and Student of a <status> group lesson with "This and the following lessons"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has opened editing lesson page
        When "school admin" adds "teacher T2" and "student S2" in lesson edit page
        And "school admin" clicks save the changes with "<status>" "This and the following lessons" saving option

        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "see" "teacher T2" in lesson detail page on CMS
        And "school admin" can "see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "see" "teacher T2" & "student S2" in other "<status>" lessons in chain "after" the edited lesson
        And "school admin" can "not see" "teacher T2" & "student S2" in other "<status>" lessons in chain "before" the edited lesson
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin adds Teacher and Student of a <status> group lesson with "Only this Lesson"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has opened editing lesson page
        When "school admin" adds "teacher T2" and "student S2" in lesson edit page
        And "school admin" clicks save the changes with "<status>" "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "see" "teacher T2" in lesson detail page on CMS
        And "school admin" can "see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "not see" "teacher T2" & "student S2" in other "<status>" lessons in chain "before" the edited lesson
        And "school admin" can "not see" "teacher T2" & "student S2" in other "<status>" lessons in chain "after" the edited lesson
        Examples:
            | status    |
            | Draft     |
            | Published |
