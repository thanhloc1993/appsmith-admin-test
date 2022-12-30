@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Submit exam lo for the first time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page

    #TCID:None
    Scenario Outline: The 1st time student submits exam lo with <some> questions and <correct> corrected answers
        Given school admin goes to the LO "exam LO" detail page
        And school admin creates question and question group detail in "exam LO"
            | groupType           | questionList                                                           |
            | group               | fill in the blank, fill in the blank, multiple answer, multiple answer |
            | individual question | multiple choice                                                        |
            | group               | empty                                                                  |
            | group               | multiple choice                                                        |
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