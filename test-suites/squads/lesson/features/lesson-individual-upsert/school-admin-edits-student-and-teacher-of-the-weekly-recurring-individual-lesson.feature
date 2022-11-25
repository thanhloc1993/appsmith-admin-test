@cms
@lesson
@lesson-individual-upsert
@ignore

Feature: School Admin edits student and teacher of the weekly recurring individual lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin removes Teacher and Student of a <status> individual lesson with "This and following lessons"
        Given "school admin" has created a "<status>" "future weekly recurring" lesson with teacher "T1,T2", student "S1,S2"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "future" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" removes teacher "teacher T2" in lesson page on CMS
        And "school admin" removes student "student S2" in lesson page on CMS
        And "school admin" saves the changes with "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "teacher T2" in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "not see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "not see" "teacher T2" & "student S2" in other "<status>" lessons in chain "after" the edited lesson
        And "school admin" can "see" "teacher T2"&"student S2" in other "<status>" lessons in chain "before" the edited lesson
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin removes Teacher and Student of a <status> weekly recurring individual lesson with "Only this Lesson" option
        Given "school admin" has created a "<status>" "past weekly recurring" lesson with teacher "T1,T2", student "S1,S2"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "past" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" removes teacher "teacher T2" in lesson page on CMS
        And "school admin" removes student "student S2" in lesson page on CMS
        And "school admin" saves the changes with "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "teacher T2" in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "not see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "see" "teacher T2"&"student S2" in other "<status>" lessons in chain
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin adds Teacher and Student of a <status> individual lesson with "This and following lessons"
        Given "school admin" has created a "<status>" "future weekly recurring" individual lesson with teacher "T1", student "S1"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "future" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" adds "teacher T2" and "student S2" in lesson edit page
        And "school admin" saves the changes with "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "see" "teacher T2" in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "see" "teacher T2"&"student S2" in other lessons in chain "after" the edited lesson
        And "school admin" can "not see" "teacher T2"&"student S2" in other "<status>" lessons in chain "before" the edited lesson
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin adds Teacher and Student of a <status> weekly recurring individual lesson with "Only this Lesson" option
        Given "school admin" has created a "<status>" "past weekly recurring" individual lesson with teacher "T1", student "S1"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "past" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" adds "teacher T2" and "student S2" in lesson edit page
        And "school admin" saves the changes with "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "see" "teacher T2" in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "see" "student S2" in student list in lesson detail page of the "<status>" lesson on CMS
        And "school admin" can "not see" "teacher T2" and "student S2" in other "<status>" lessons in chain
        Examples:
            | status    |
            | Draft     |
            | Published |
