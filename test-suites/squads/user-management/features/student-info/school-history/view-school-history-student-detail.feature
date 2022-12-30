@cms
@user @student-school-history

Feature: View school history in student detail

    Background:
        Given "school admin" logins CMS
        And the master has data of "School Level & School & School Course" correctly
        And school admin has created a student "with full fields" for School History

    Scenario Outline: View school history in student detail by"<conditions>"
        When school admin goes to student detail by "<conditions>"
        Then school admin "sees" school history of the student displayed
        Examples:
            | conditions |
            | URL        |
            | Menu       |

    @ignore
    Scenario Outline: View school history after changing "<attributes>"
        When school admin "<actions>" "<attributes>" on the Master Management
        And school admin goes to student detail by "Menu"
        Then school admin "sees" school history of the student displayed
        Examples:
            | attributes    | actions    |
            | School Level  | edits name |
            | School Level  | archives   |
            | School        | edits name |
            | School        | archives   |
            | School Course | edits name |
            | School Course | archives   |