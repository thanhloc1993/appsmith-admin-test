@cms @learner @teacher
@syllabus @exam-lo @exam-lo-common

Feature: Manual Grading Exam

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And school admin has created a exam lo with settings
            | manualGrading | gradeToPass | totalQuestions |
            | off           | null        | 4              |
        And school admin has created a matched studyplan for student
        And student has submitted exam lo with doing 4 questions

    Scenario: Teacher views score of exam lo with manual grading is off and grade to pass is null
        When teacher goes to student study plan page
        Then teacher sees the total graded point per total point of exam lo
        And teacher sees the latest status of exam lo is completed
        And teacher also see the score and status of latest attempt when click on the arrow icon
