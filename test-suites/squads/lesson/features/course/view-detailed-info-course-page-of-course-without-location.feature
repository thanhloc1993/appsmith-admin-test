@cms
@lesson
@course
@ignore

Feature: School admin can view detailed info course page of course without location
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page

    Scenario: School admin can view detailed info course page of course without location
        Given "school admin" has filled course name
        And "school admin" has created a new course
        When "school admin" goes to detailed course info page under setting tab
        Then "school admin" does not see location in location field
        And "school admin" sees course name
        And "school admin" see default course avatar