@cms
@user @student-location

Feature: School admin can cancel editing student with location
    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with location info
        And "school admin" has been editing student

    Scenario Outline: School admin can cancel editing student with location
        Given "school admin" has edited student location by adding more locations
        When "school admin" cancels the editing process by using "<option>"
        And "school admin" cancels leaving editing student page
        Then "school admin" is still in editing student page
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |

    Scenario Outline: School admin can leave editing student with location
        Given "school admin" has edited student location by adding more locations
        When "school admin" cancels the editing process by using "<option>"
        And "school admin" leaves editing student page
        Then "school admin" is redirected to Student Detail page
        And "school admin" sees nothing changed in Student Detail page
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |

    Scenario Outline: School admin can cancel editing location on Location Selection popup
        Given "school admin" has opened Location Selection popup
        And "school admin" selects location
        When "school admin" cancels the editing process by using "<option>"
        Then "school admin" sees Selection popup closed
        And "school admin" sees nothing changed in Student Edit page
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |