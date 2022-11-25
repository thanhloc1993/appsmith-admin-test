@cms
@user @staff-info

Feature: View staff list

    Background:
        Given "school admin" logins CMS
        And school admin selects all locations on location setting

    Scenario Outline: View staff list
        When school admin goes to staff list page by "<option>"
        Then school admin sees the staff list is displayed correctly
        Examples:
            | option |
            | URL    |
            | Menu   |

    Scenario Outline: Able to change row per page on staff list
        Given staff list has more than 3 pages
        And school admin is not on the "first" page of staff list
        When school admin changes the rows per page of staff list into "<numberOfRowsPerPage>"
        Then school admin sees the staff list is on the first page
        And school admin sees the rows per page of the staff list is "<numberOfRowsPerPage>"
        And school admin sees the staff list is displayed correctly
        Examples:
            | numberOfRowsPerPage |
            | 5                   |
            | 25                  |
            | 50                  |
            | 100                 |

    Scenario Outline: Able to paging on staff list
        Given staff list has more than 3 pages
        And school admin is not on the "<page>" page of staff list
        When school admin goes to "<action>" page of staff list
        Then school admin sees the staff list is displayed correctly
        Examples:
            | page  | action   |
            | first | previous |
            | end   | next     |
