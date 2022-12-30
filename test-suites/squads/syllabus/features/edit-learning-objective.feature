@cms @teacher @learner
@syllabus @question @question-common

Feature: Edit LO

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "has 1 learning objective" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0067
    Scenario Outline: Student and teacher can see the edited LO's <info> when admin edits LO's <info>
        Given school admin is at book detail page
        When school admin edits LO "<info>"
        Then school admin sees the edited LO "<info>" on CMS
        And student sees the edited LO "<info>" on Learner App
        And teacher sees the edited LO "<info>" on Teacher App
        Examples:
            | info             |
            | name             |
            | video            |
            | brightcove video |
            | pdf              |