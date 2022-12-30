@cms @learner @teacher
@syllabus @staging @question
@exam-lo @question-common

Feature: Edit Points per Question

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And school admin has created a "simple content with 1 LO exam has 1 question" book
        And school admin goes to book detail page
        And school admin goes to the LO "exam LO" detail page
        And school admin has created a matched studyplan for student

    Scenario: View points per question after editing in Exam LO
        When student answers and submits exam lo
        And school admin edits points per question in exam LO
        And student retakes and submits exam lo
        And student goes back to exam attempt history
        Then teacher sees the score of the old attempt with no change
        And teacher sees the score of the new attempt changed
        And student sees total score has changed

    Scenario: View points per question after deleting and adding question in Exam LO
        When student answers and submits exam lo
        And school admin deletes the question and adds new a question
        And student retakes and submits exam lo
        And student goes back to exam attempt history
        Then teacher sees the score of the old attempt with no change
        And teacher sees the score of the new attempt changed
        And student sees total score has changed
