@cms
@user @student-search-filter
Feature: Search for student name

    Background:
        Given "school admin" logins CMS
        And student list has many records

    Scenario Outline: Search for student name
        When school admin searches for "<existed>" keywords
        Then the student list is displayed student which matches keywords
        Examples:
            | existed           |
            | name              |
            | firstName         |
            | lastName          |
            | firstNamePhonetic |
            | lastNamePhonetic  |
            | fullNamePhonetic  |

    Scenario Outline: Search for non-existed student name
        When school admin searches for "<non-existed>" keywords
        Then no result page is displayed
        Examples:
            | non-existed                          |
            | firstName & lastName                 |
            | firstNamePhonetic & lastNamePhonetic |
            | lastName & firstNamePhonetic         |
            | lastNamePhonetic & firstName         |

    Scenario: Able to clear search for student name
        When school admin searches for keywords
        And school admin removes the keywords
        Then the student list is displayed full records

    Scenario: Go to first page of result after searching student name
        Given school admin is not on the "first" page of student list
        And school admin changes the rows per page into "5"
        When school admin searches for keywords
        Then school admin is on the first page of student list with "5" rows per page
        And the student list is displayed student which matches keywords