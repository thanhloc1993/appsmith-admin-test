@cms @cms2 @teacher @learner
@lesson
@lesson-individual-upsert

Feature: Create an individual lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has applied "all child locations of parent" location
        And "teacher" has applied "all child locations of parent" location
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page
        And "teacher" has applied center location in location settings on Teacher App

    Scenario Outline: School admin can create <status> future individual lesson with online teaching method
        Given "school admin" has filled date & time is within 10 minutes from now in create lesson page
        And "school admin" has filled all remain fields in create lesson page
        And "school admin" has filled online teaching medium
        And "school admin" has filled individual teaching method
        # all remain fields: teacher, student, location
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "<status>" "future" lesson on the list on CMS
        And "teacher" sees newly created "<status>" "future" lesson on the list on CMS
        And "teacher" "<action>" new "future" lesson on Teacher App
        And "student" "<action>" the new lesson on Learner App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |

    Scenario Outline: School admin can create <status> past individual lesson with online teaching method
        Given "school admin" has filled start & end time have been completed in the last 24 hours in create lesson page
        And "school admin" has filled all remain fields in create lesson page
        And "school admin" has filled online teaching medium
        And "school admin" has filled individual teaching method
        #all remain fields: teacher, student, location
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees newly created "<status>" "past" lesson on the list on CMS
        And "teacher" sees newly created "<status>" "past" lesson on the list on CMS
        And "teacher" "<action>" new "past" lesson on Teacher App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |
#
    Scenario Outline: School admin can create <status> future individual lesson with offline teaching method
        Given "school admin" has filled date & time is within 10 minutes from now in create lesson page
        And "school admin" has filled all remain fields in create lesson page
        And "school admin" has filled offline teaching medium
        And "school admin" has filled individual teaching method
        #all remain fields: teacher, student, location
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "<status>" "future" lesson on the list on CMS
        And "teacher" sees newly created "<status>" "future" lesson on the list on CMS
        And "teacher" does not see new "future" lesson on Teacher App
        And "student" does not see the new lesson on Learner App
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can create <status> past individual lesson with offline teaching method
        Given "school admin" has filled start & end time have been completed in the last 24 hours in create lesson page
        And "school admin" has filled all remain fields in create lesson page
        And "school admin" has filled offline teaching medium
        And "school admin" has filled individual teaching method
        #all remain fields: teacher, student, location
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees newly created "<status>" "past" lesson on the list on CMS
        And "teacher" sees newly created "<status>" "past" lesson on the list on CMS
        And "teacher" does not see new "future" lesson on Teacher App
        And "student" does not see the new lesson on Learner App
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin cannot create an individual lesson with missing required <field>
        When "school admin" creates an individual lesson with missing required "<field>"
        Then "school admin" sees alert message under required "<field>" in creating lesson page
        And "school admin" is still in creating lesson page cms
        Examples:
            | field      |
            | start time |
            | end time   |
            | teacher    |
            | center     |