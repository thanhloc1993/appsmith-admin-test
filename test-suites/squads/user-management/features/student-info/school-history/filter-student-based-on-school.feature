@cms
@user @student-info @student-school-history

Feature: Filter Students Base On Schools

    Background:
        Given "school admin" logins CMS
        And the master has data of "School Level & School & School Course" correctly

    Scenario Outline: Filter students base on "<conditions>"
        Given school admin has created a student "with full fields <schoolConditions>" for School History
        When school admin filters students by "<conditions>"
        Then school admin sees the results filtered match to "<conditions>"
        Examples:
            | conditions          | schoolConditions         |
            | only current school | having current school    |
            | include all school  | no having current school |