@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Submit exam lo for multiple time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0571
    Scenario Outline: Student submit exam lo <time> times
        Given school admin creates 2 questions of each question type in Exam LO
        When student does and submit exam lo <time> times with randomness
        Then <time> exam lo's submission of student is updated on Teacher App

        Examples:
            | time |
            | 2    |
            | 4    |