@cms @cms2 @teacher
@lesson
@lesson-upsert
@ignore

Feature: Teacher edit material of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened editing lesson page

    Scenario Outline: Teacher can add <material>
        When "teacher" adds file "<material>" to the lesson of lesson management on CMS
        And "teacher" saves the lesson with file "<material>"
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" sees added file "<material>" in the lesson on CMS
        And "teacher" sees added file "<material>" in "future" lesson on Teacher App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario Outline: Teacher can remove <material>
        Given "teacher" has attached a pdf and a video in the lesson on CMS
        And "teacher" has opened editing lesson page
        When "teacher" removes file "<material>" from the lesson on CMS
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" does not see file "<material>" in the lesson on CMS
        And "teacher" does not see file "<material>" in "future" lesson on Teacher App
        Examples:
            | material |
            | pdf      |
            | video    |