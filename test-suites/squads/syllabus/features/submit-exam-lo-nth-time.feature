@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Submit exam lo for the nth time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0571
    Scenario Outline: The <current time>th time student submits exam lo with <some> questions and <correct> corrected answers
        Given school admin creates 2 questions of each question type in Exam LO
        And student is in Take Again mode for <previous time>th time
        And student has done <some> questions with <correct> corrected answers
        When student submits exam lo the <current time>th time
        Then exam lo's result of student is updated on Learner App
        And exam lo's result of student is updated on Teacher App

        Examples:
            | current time | previous time | some | correct |
            | 3            | 2             | 0    | 0       |
            | 3            | 2             | 2    | 0       |
            | 3            | 2             | 2    | 2       |
            | 3            | 2             | 6    | 2       |
            | 3            | 2             | 6    | 6       |