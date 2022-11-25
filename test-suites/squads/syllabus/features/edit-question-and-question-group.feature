@cms @learner
@syllabus @question @question-common @question-v2
@ignore

Feature: edit and view question group detail and question in question group on Learner App

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with 2 LO learning, exam" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page

    Scenario Outline: Student can see edited question group detail and question in question group
        Given school admin creates question and question group detail in "<LOType>"
            | groupType | questionList      |
            | group     | fill in the blank |
        And student sees the new question and question group on CMS with "<LOType>"
        When school admin edits the question group detail with "<LOType>"
        And school admin edits the question "<questionType>" with "<content>" in question group
        Then school admin sees the edited the question group detail with "<LOType>"
        And school admin sees the edited the question in question group on CMS with "<LOType>"
        And student sees the edited the question group detail and the question in question group on Learner App with "<LOType>"
        Examples:
            | LOType             | questionType                            | content     |
            | learning objective | 1 of [multiple answer, multiple choice] | description |
            | exam LO            | 1 of [multiple answer, multiple choice] | description |
