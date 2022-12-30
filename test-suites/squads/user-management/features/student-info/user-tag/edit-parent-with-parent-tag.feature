@cms
@user @user-tag
@User_StudentManagement_BackOffice_ParentTag

Feature: Edit Parent with Parent Tag on CMS
    Background:
        Given "school admin" logins CMS
        And school admin has imported "parent tag & parent discount tag" master data
        And school admin creates a new student with parent and "both parent tag and parent discount tag"

    Scenario Outline: Edit parent with "<parentTagAction>"
        When school admin edits parent tag by "<parentTagAction>"
        Then school admin sees the parent with parent tag on CMS
        Examples:
            | parentTagAction                                  |
            | adding single parent tag                         |
            | adding single parent discount tag                |
            | adding both parent tag and parent discount tag   |
            | removing single parent tag                       |
            | removing single parent discount tag              |
            | removing both parent tag and parent discount tag |
            | removing all tag                                 |
