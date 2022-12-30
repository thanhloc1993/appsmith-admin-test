@cms
@user @student-school-history

Feature: School History Fields Validation

    Background:
        Given "school admin" logins CMS
        And the master has data of "School Level & School & School Course" correctly
        And school admin is adding student with all required fields in General Info

    Scenario Outline: Validate "<fields>" in school history with "<actions>"ing
        When school admin adds 1 draft School History
        And school admin "<actions>" "<fields>" field
        Then school admin sees the "<fields>" displayed "<expectedOption>"
        Examples:
            | fields        | actions | expectedOption                                      |
            | School Level  | click   | full options                                        |
            | School Name   | click   | full options                                        |
            | School Course | click   | on optional                                         |
            | School Level  | select  | School Name belong to School Level                  |
            | School Name   | select  | School Level auto-fill option belong to School Name |