@cms @learner @teacher
@syllabus @exam-lo @question-common @question
@Syllabus_ExamLO_BackOffice_PointsPerQuestion

Feature: Create points per question in exam lo

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And school admin has created a "1 exam lo with 1 question random points" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page
        And school admin goes to create question page in "exam LO"

    Scenario Outline: Create points per <type> question in exam lo
        When school admin creates points per "<type>" question
        Then school admin sees points per question on preview
        And student goes to "exam LO" detail screen from home screen
        And student sees points per question in exam LO
        And teacher goes to "exam LO" detail screen from home page
        And teacher sees points per question in exam LO
    
        Examples:
            | type                                                       |
            | 1 of [multiple choice, fill in the blank, multiple answer] |
        