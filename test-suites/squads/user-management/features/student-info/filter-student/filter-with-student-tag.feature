@cms
@user @user-tag
@User_StudentManagement_BackOffice_StudentTag

Feature: Filter students with Student Tag on CMS

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Filter students with "<studentTag>"
        Given school admin has imported "<userTag>" master data
        When school admin creates a new student with "<studentTag>"
        And school admin filter the student with tag "<studentTag>"
        Then school admin sees all student includes tag "<studentTag>"
        Examples:
            | studentTag                                | userTag                            |
            | single student tag                        | student tag                        |
            | single student discount tag               | student discount tag               |
            | both student tag and student discount tag | student tag & student discount tag |