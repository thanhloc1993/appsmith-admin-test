@cms @teacher @learner
@syllabus @retry-mode
Feature: Resume learning on retry mode

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    
    #TCID:syl-0321
    Scenario Outline: Resume learning after student practiced all quizzes in LO
        Given school admin creates 10 questions in Quiz LO
        And student has completed Quiz LO with 0 incorrect response in "<learning flow>"
        And student has selected to practice again
        And student has done "1 of [1,2,3,4,5,6,7,8,9]" questions
        And student stops learning
        When student goes to Quiz LO again in "<learning flow>"
        Then student resumes to current quiz set

        Examples:
            | learning flow |
            | todo flow     |
            | course flow   |
    
    #TCID:syl-0323
    Scenario Outline: Resume learning after student had entered Retry Incorrect Mode
        Given school admin creates 10 questions in Quiz LO
        And student has completed Quiz LO with "1 of [5,6,7,8,9,10]" incorrect response in "<learning flow>"
        And student has selected to retry incorrect
        And student has done incorrect "1 of [1,2,3,4]" questions
        And student stops learning
        When student goes to Quiz LO again in "<learning flow>"
        Then student resumes to current quiz set

        Examples:
            | learning flow |
            | todo flow     |
            | course flow   |