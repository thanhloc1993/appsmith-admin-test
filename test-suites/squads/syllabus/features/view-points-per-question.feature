@cms @learner @teacher
@syllabus @exam-lo @question-common @question
@Syllabus_ExamLO_BackOffice_PointsPerQuestion

Feature: View points per question in exam lo
    
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And school admin has created a "1 exam lo with 2 questions random points" book
        And school admin has created a matched studyplan for student
        And student goes to "exam LO" detail screen from home screen
        
    Scenario: Student and teacher views points per question after exam lo has submissions
        When student submits exam lo with attempt 1
        And student submits exam lo with attempt 2
        And student goes to "exam LO" detail screen from topic detail screen
        Then student sees points per question in exam lo's attempt 1
        And student sees points per question in exam lo's attempt 2
        And teacher goes to "exam LO" marking page from home page
        And teacher sees points per question in exam lo's attempt 1
        And teacher sees points per question in exam lo's attempt 2
        