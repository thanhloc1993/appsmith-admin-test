@cms @teacher @teacher2 @learner @learner2
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin can edit one time group lesson by removing

    Background:
        Given "school admin" logins CMS
        And "teacher T1" login Teacher App
        And "student S1" with course and enrolled status has logged Learner App

    Scenario Outline: School Admin can edit a <status> one time group lesson by removing teacher
        Given "school admin" has created a "<status>" group lesson in the "past" with "Online" teaching medium
        And "teacher T2" login Teacher App
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "past" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" adds teacher "teacher T2" in lesson page on CMS
        And "school admin" removes teacher "teacher T1" in lesson page on CMS
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "teacher T1" in lesson detail page on CMS
        And "teacher T1" can "<action>" new "past" one time group lesson on Teacher App
        And "teacher T2" can "<action>" new "past" one time group lesson on Teacher App
        Examples:
            | status    | action      |
            | Draft     | can not see |
            | Published | can see     |

    Scenario Outline: School Admin can edit a <status> one time group lesson by removing student
        Given "teacher T2" login Teacher App
        And "school admin" has created a "<status>" group lesson in the "future" with "Online" teaching medium
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "future" lesson info page
        And "school admin" has opened editing lesson page
        And "student S2" with course and enrolled status has logged Learner App
        When "school admin" adds student "student S2" in lesson page on CMS
        And "school admin" removes student "student S1" in lesson page on CMS
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "student S1" in student list in lesson detail page on CMS
        And "school admin" can "see" "student S2" in student list in lesson detail page on CMS
        And "teacher T1" can "not see" "student S1" in student list on Teacher App
        And "student S1" can "not see" new one time group lesson on Learner App
        And "student S2" can "<action>" new one time group lesson on Learner App
        Examples:
            | status    | action      |
            | Draft     | can not see |
            | Published | can see     |

    Scenario Outline: School Admin can edit a <status> one time group lesson by removing class
        Given "school admin" has created a "<status>" group lesson in the "future" with "Online" teaching medium
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed the newly "future" lesson info page
        When "school admin" removes class in lesson page on CMS
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees class field is blank
        Examples:
            | status    |
            | Draft     |
            | Published |
