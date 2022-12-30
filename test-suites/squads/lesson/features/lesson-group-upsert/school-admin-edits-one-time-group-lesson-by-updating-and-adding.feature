@cms
@teacher @teacher2
@learner @learner2
@lesson
@lesson-group-upsert

Feature: School Admin can edit one time group lesson by updating and adding
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App

    Scenario Outline: School admin can update date&time of a <status> one time group lesson
        Given "school admin" has created a "<status>" "One Time" group lesson with filled all information in the "<lesson time>"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "teacher T1" has applied center location in location settings on Teacher App
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits lesson date and start&end time to the "<lesson time moved to>"
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson date&time on CMS
        And "school admin" sees this lesson in the "<lesson time moved to>" lesson list page
        And "teacher T1" can "<action>" the "<lesson time moved to>" lesson on Teacher App
        Examples:
            | status    | lesson time | lesson time moved to | action  |
            | Draft     | future      | past                 | not see |
            | Published | past        | future               | see     |

    Scenario Outline: School admin can add teacher and student to the <status> future one time group lesson
        Given "school admin" has created a "<status>" "One Time" group lesson with filled all information in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        And "teacher T2" logins Teacher App
        And "teacher T2" has applied center location in location settings on Teacher App
        And "student S2" with course and class and enrolled status has logged Learner App
        When "school admin" adds "teacher T2" and "student S2" to the lesson on CMS
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added "teacher T2" and "student S2" in detailed lesson info page on CMS
        And "teacher T2" can "<action>" the "future" lesson on Teacher App
        And "student S2" can "<action>" the "future" lesson on Learner App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |

    Scenario Outline: School admin can update location, course, class of a <status> future one time group lesson
        Given "school admin" has created a "<status>" "One Time" group lesson with filled all information in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits Location of the group lesson
        And "school admin" selects course in detailed lesson info page on CMS
        And "school admin" selects class in detailed lesson info page on CMS
        And "school admin" updates student location of the group lesson
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated location, course, class and student on CMS
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can update course of a <status> future one time group lesson
        Given "school admin" has created a "<status>" "One Time" group lesson with filled all information in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" updates course in detailed group lesson info page on CMS
        And "school admin" selects class in detailed lesson info page on CMS
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated course and class on CMS
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can update class of a <status> future one time group lesson
        Given "school admin" has created a "<status>" "One Time" group lesson with filled all information in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" updates class in detailed group lesson info page on CMS
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated class on CMS
        Examples:
            | status    |
            | Draft     |
            | Published |
