@cms
@user @user-tag
@User_StudentManagement_BackOffice_ParentTag

Feature: Create Parent with Parent Tag on CMS

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Create parent with "<parentTag>"
        Given school admin has imported "<userTag>" master data
        When school admin creates a new student with parent and "<parentTag>"
        Then school admin sees the parent with parent tag on CMS
        Examples:
            | parentTag                               | userTag                          |
            | single parent tag                       | parent tag                       |
            | single parent discount tag              | parent discount tag              |
            | both parent tag and parent discount tag | parent tag & parent discount tag |