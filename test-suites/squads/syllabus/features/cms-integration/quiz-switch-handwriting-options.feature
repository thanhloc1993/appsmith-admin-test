@cms
@syllabus @question-v2 @question-handwriting
@cms-syllabus-integration @staging
@Syllabus_Quiz_BackOffice_Handwriting

Feature: [Integration] FiB Question - Switching handwriting options

    Background:
        Given "school admin" logins CMS
        And school admin has created a "1 LO without quiz" book
        And school admin goes to book detail page
        And school admin goes to create question page

    Scenario Outline: School admin switches handwriting option from <from> to <to>
        When school admin selects fill in the blank question with handwriting option "<from>"
        And school admin switches handwriting option to "<to>"
        Then school admin sees confirm change handwriting dialog
        And school admin sees answer content is deleted

        Examples:
            | from     | to       |
            | English  | Math     |
            | Japanese | Math     |
            | Off      | Math     |
            | Math     | English  |
            | Math     | Japanese |
            | Math     | Off      |