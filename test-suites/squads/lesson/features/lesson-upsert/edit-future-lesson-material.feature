@cms @teacher
@lesson
@lesson-upsert
@ignore

Feature: Edit material of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page

    Scenario Outline: School admin can add <material>
        When "school admin" adds file "<material>" to the lesson of lesson management on CMS
        And "school admin" saves the lesson with file "<material>"
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added file "<material>" in the lesson on CMS
        And "teacher" sees added file "<material>" in "future" lesson on Teacher App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario Outline: School admin can remove <material>
        Given "school admin" has attached a pdf and a video in the lesson on CMS
        And "school admin" has opened editing lesson page
        When "school admin" removes file "<material>" from the lesson on CMS
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see file "<material>" in the lesson on CMS
        And "teacher" does not see file "<material>" in "future" lesson on Teacher App
        Examples:
            | material |
            | pdf      |
            | video    |
