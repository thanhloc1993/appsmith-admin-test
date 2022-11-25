@cms
@user @user-tag
@User_StudentManagement_BackOffice_StudentTag

Feature: Create Student with Student Tag on CMS

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Create student with "<studentTag>"
        Given school admin has imported "<userTag>" master data
        When school admin creates a new student with "<studentTag>"
        Then school admin sees the student with student tag on CMS
        Examples:
            | studentTag                                | userTag                            |
            | single student tag                        | student tag                        |
            | single student discount tag               | student discount tag               |
            | both student tag and student discount tag | student tag & student discount tag |