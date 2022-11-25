@cms @teacher @learner
@syllabus @question @question-common

Feature: Edit LO

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 1 quiz" book
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