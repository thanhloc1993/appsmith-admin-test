@cms
@user @user-tag
@User_StudentManagement_BackOffice_StudentTag

Feature: Edit Student with Student Tag on CMS
    Background:
        Given "school admin" logins CMS
        And school admin has imported "student tag & student discount tag" master data
        And school admin creates a new student with "both student tag and student discount tag"

    Scenario Outline: Edit student with "<studentTagAction>"
        When school admin edits student tag by "<studentTagAction>"
        Then school admin sees the student with student tag on CMS
        Examples:
            | studentTagAction                                   |
            | adding single student tag                          |
            | adding single student discount tag                 |
            | adding both student tag and student discount tag   |
            | removing single student tag                        |
            | removing single student discount tag               |
            | removing both student tag and student discount tag |
            | removing all tag                                   |
