@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin searches book integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "empty" book
        And school admin is at book page

    Scenario Outline: School admin can search book <searchName> name
        When school admin searches book "<searchName>" name
        Then school admin sees "<searchResult>" books matches with search

        Examples:
            | searchName     | searchResult                         |
            | exist          | list of books related to the keyword |
            | does not exist | empty list                           |
