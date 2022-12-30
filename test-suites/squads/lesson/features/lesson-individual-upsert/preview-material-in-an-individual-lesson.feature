@cms @teacher
@lesson-individual-upsert

Feature: Preview attached material in an individual lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: School admin and Teacher can preview both <material> in an individual lesson
        When school admin creates a online future individual lesson with attached "<material>" on CMS
        Then school admin sees lesson's "<material>" in lesson detail of individual lesson screen on CMS
        And school admin can preview "<material>" material of lesson page detail on CMS
        And "teacher" can see "<material>" material of the lesson page on Teacher App
        And "teacher" can preview "<material>" material of the lesson page on Teacher App
        Examples:
            | material                       |
            | pdf                            |
            | video                          |
            | brightcove video               |
            | pdf, video                     |
            | pdf 1, pdf 2, video 1, video 2 |