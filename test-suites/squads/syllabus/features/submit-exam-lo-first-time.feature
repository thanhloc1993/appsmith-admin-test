@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Submit exam lo for the first time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:None
    Scenario Outline: The 1st time student submits exam lo with <some> questions and <correct> corrected answers
        Given school admin creates 2 questions of each question type in Exam LO
        And student has done <some> questions with <correct> corrected answers
        When student submits exam lo
        Then exam lo's result of student is updated on Learner App
        And exam lo's result of student is updated on Teacher App

        Examples:
            | some | correct |
            | 0    | 0       |
            | 2    | 0       |
            | 2    | 2       |
            | 6    | 2       |
            | 6    | 6       |