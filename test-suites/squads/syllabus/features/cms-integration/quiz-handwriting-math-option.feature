@cms
@syllabus @question-v2
@cms-syllabus-integration @staging
@Syllabus_Quiz_BackOffice_Handwriting

Feature: [Integration] Create the fill in the blank question with handwriting MATH option
    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content without quiz" book
        And school admin goes to book detail page

    Scenario: School admin works with OCR when creating FiB question with handwriting
        Given school admin goes to create question page
        When school admin creates a fill in the blank question with all handwriting settings
        And school admin uploads quiz material
        And school admin scans "Text/Image/Latex" from the quiz material and capture available options
        Then school admin cannot scan "Image/Latex" for answers with handwriting setting is "Off"
        And school admin cannot scan "Latex/Image" for answers with handwriting setting is "Japanese"
        And school admin cannot scan "Latex/Image" for answers with handwriting setting is "English"
        And school admin cannot scan "Text/Image" for answers with handwriting setting is "Math"
