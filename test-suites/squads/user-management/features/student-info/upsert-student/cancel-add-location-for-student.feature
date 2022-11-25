@cms
@user @student-location

Feature: School admin can cancel adding student with location
    Background:
        Given "school admin" logins CMS
        And "school admin" has been creating student

    Scenario Outline: School admin can cancel adding student with location
        Given "school admin" has filled all fields along with location
        When "school admin" cancels the adding process by using "<option>"
        And "school admin" cancels leaving adding student page
        Then "school admin" is still in adding student page
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |

    Scenario Outline: School admin can leave adding student with location
        Given "school admin" has filled all fields along with location
        When "school admin" cancels the adding process by using "<option>"
        And "school admin" leaves adding student page
        Then "school admin" is redirected to Student Management page
        And "school admin" does not see new student on CMS
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |

    Scenario Outline: School admin can cancel adding location on Location Selection popup
        Given "school admin" has opened Location Selection popup
        And "school admin" selects location
        When "school admin" cancels the adding process by using "<option>"
        Then "school admin" sees Selection popup closed
        And "school admin" does not sees the selected location in adding student page
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |