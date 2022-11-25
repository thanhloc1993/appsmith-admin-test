@cms
@syllabus @question-v2
@cms-syllabus-integration
@Syllabus_ExamLO_BackOffice_PointsPerQuestion

Feature: [Integration] Create points per question

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 1 LO exam" book
        And school admin goes to book detail page
        And school admin goes to create question page in "exam LO"

    Scenario Outline: School admin creates points per <type> question in exam LO
        When school admin creates points per "<type>" question
        Then school admin sees message "You have created a new question successfully"
        And school admin sees points per question on preview

        Examples:
            | type                                                       |
            | 1 of [multiple choice, fill in the blank, multiple answer] |
