@cms
@user @student-info @student-school-history

Feature: Edit School History Student

    Background:
        Given "school admin" logins CMS
        And the master has data of "School Level & School & School Course" correctly
        And school admin has created a student "with full fields" for School History

    Scenario Outline: Edit School History with deselects "<attributes>"
        When school admin deselects the previously chosen "<attributes>"
        Then  school admin sees "<fields>" fields becomes blank
        Examples:
            | attributes    | fields                                                             |
            | School Level  | School Level & School Name & School Course & Start Date & End Date |
            | School Name   | School Name & School Course                                        |
            | School Course | School Course                                                      |

    @ignore
    Scenario: Edit All Values School History
        When school admin changes all values School History to others
        Then school admin "sees" school history of the student displayed