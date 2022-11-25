@cms
@architecture @course

Feature: View course list

    Background:
        Given "school admin" logins CMS
        And school admin is on the "Course" page

    Scenario: View course list
        When school admin views course list
        Then all courses are displayed

    Scenario Outline: School admin is able to change page of course list
        Given course list has at least 3 pages
        And school admin is not on the "<page>" page of course list
        When school admin goes to the "<action>" page
        Then all courses of current page are displayed correctly after moving page
        Examples:
            | page  | action   |
            | first | previous |
            | last  | next     |