@cms
@user @student-school-history

Feature: View current school in student list

    Background:
        Given "school admin" logins CMS
        And the master has data of "School Level & School & School Course" correctly

    Scenario Outline: View current school in student list by "<conditions>"
        Given school admin has created a student "<createSchoolConditions>" for School History
        When school admin goes to student list by "<conditions>"
        Then school admin "<expectedConditions>" current school in student list
        Examples:
            | conditions | createSchoolConditions                 | expectedConditions |
            | Menu       | with full fields having current school | sees               |
            | Menu       | without school history                 | does not see       |
            | URL        | with full fields having current school | sees               |
            | URL        | without school history                 | does not see       |

    @ignore
    Scenario Outline: View current school in student list after changing school name
        Given school admin has created a student "with full fields having current school" for School History
        When school admin "<actions>" "School" on the Master Management
        And school admin goes to student list by "Menu"
        Then school admin "sees" current school in student list
        Examples:
            | actions    |
            | edits name |
            | archives   |