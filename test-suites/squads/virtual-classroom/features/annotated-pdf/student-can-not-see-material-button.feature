@cms @learner
@virtual-classroom
@virtual-classroom-annotated-pdf

Feature: Student can view material depends on lesson status
    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App

    Scenario: Student can not see material button of a future lesson
        Given school admin has created a "future" lesson of lesson management with attached "pdf" on CMS
        When "student" goes to lesson tab on Learner App
        Then "student" "does not see" material button beside join button on Learner App

    Scenario: Student can see material file of a past lesson
        Given school admin has created a "past" lesson of lesson management with attached "pdf" on CMS
        When "student" goes to lesson tab on Learner App
        And "student" goes to materials page on Learner App
        Then "student" "can see" file name with form: [original PDF file name]_note
        And "student" "does not see" any file name without including _note