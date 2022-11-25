@cms
@user @user-tag
@User_StudentManagement_BackOffice_ParentTag

Feature: Filter students whose parent has Parent Tag on CMS

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Filter parent's student with "<parentTag>"
        Given school admin has imported "<userTag>" master data
        When school admin creates a new student with parent and "<parentTag>"
        And school admin filter the parent's student with tag "<parentTag>"
        Then school admin goes to detail sees the parent's student includes tag "<parentTag>"
        Examples:
            | parentTag                               | userTag                          |
            | single parent tag                       | parent tag                       |
            | single parent discount tag              | parent discount tag              |
            | both parent tag and parent discount tag | parent tag & parent discount tag |