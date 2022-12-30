@cms
@syllabus @question-v2
@cms-syllabus-integration
@Syllabus_ExamLO_BackOffice_PointsPerQuestion

Feature: [Integration] Edit points per question

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 1 LO exam has 1 question" book
        And school admin goes to book detail page
        And school admin goes to the LO "exam LO" detail page

    Scenario: School admin edits points per question in exam LO
        When school admin edits points per question in exam LO
        Then school admin sees message "You have updated question successfully"
        And school admin sees points per question on preview
