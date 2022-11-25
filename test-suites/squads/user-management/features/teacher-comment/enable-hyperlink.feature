@cms
@student-comment
@teacher
@course
@user

Feature: Enable hyperlink

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a student with parent info and "available" course

    Scenario Outline: Teacher <result> see and click hyperlink in Comment History
        Given "teacher" is on Comment History screen
        When "teacher" gives a comment "<condition>" "<text>"
        Then "teacher" "<result>" see and click to open the hyperlink text "<condition>" the comment
        Examples:
            | result | condition | text     |
            | can    | included  | http://  |
            | can    | included  | https:// |
            | cannot | excluded  | http://  |
            | cannot | excluded  | https:// |
