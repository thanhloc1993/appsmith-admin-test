@cms
@user @student-list
Feature: View student list

    Background:
        Given "school admin" logins CMS

    Scenario: View student list
        Given school admin goes to student list
        When school admin views student list
        # When school admin goes to student list page by "<option>"
        # Check all student means check total records and check each column per row is displayed correct data
        Then all student of this school is displayed
    # Examples:
    #     | option |
    #     | URL    |
    #     | Menu   |

    Scenario Outline: Able to paging on student list
        Given student list has more than 3 pages
        And school admin is not on the "<page>" page of student list
        When school admin goes to "<action>" page of student list
        Then data of current page is displayed correct after moving page
        Examples:
            | page  | action   |
            | first | previous |
            | end   | next     |

    @ignore
    Scenario Outline: View student list after changed Location name
        Given school admin has created a student with "1" location
        And school admin changes name of that location
        When school admin views student list by "<option>"
        Then school admin sees all student of that location is updated
        Examples:
            | option |
            | URL    |
            | Menu   |

    @ignore
    Scenario Outline: View student list with "<locationType>" location
        Given school admin has created a student with "1" location
        And school admin has set archive value of that location is "<value>"
        When school admin views student list by "<option>"
        Then school admin sees student info is displayed with "<locationType>" location
        Examples:
            | locationType | value           | option |
            | not archive  | is_archived = 0 | URL    |
            | not archive  | is_archived = 0 | Menu   |
            | archived     | is_archived = 1 | URL    |
            | archived     | is_archived = 1 | Menu   |

    @ignore
    Scenario Outline: View student list with all locations
        Given school admin has created a student with "5" location
        When school admin views student list by "<option>"
        And school admin hovers over the location list
        Then school admin sees full list of locations display on tooltip
        Examples:
            | option |
            | URL    |
            | Menu   |