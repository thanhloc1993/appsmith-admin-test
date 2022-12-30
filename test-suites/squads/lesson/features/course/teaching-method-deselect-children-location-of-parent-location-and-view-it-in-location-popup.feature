@cms
@lesson
@course
@ignore

Feature: School admin can deselect children location of parent location and view location in location popup
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has opened creating course page

    Scenario: School admin can deselect children location of parent location in location popup
        Given "school admin" has opened location popup
        And "school admin" has selected all children location of parent location in location popup
        When "school admin" deselects one children location of parent location in location popup
        Then "school admin" sees one children location of parent location is in unchecked mode
        And "school admin" sees their parent location is in indeterminate mode
        And "school admin" sees remained children location of parent location is in checked mode
        And "school admin" does not see one children location of parent location in selected field
        And "school admin" does not see their parent location in selected field
        And "school admin" still sees remained children location of parent location in selected field

    Scenario: School admin does not see deselected one children location of parent location in location field
        Given "school admin" has opened location popup
        And "school admin" has selected all children location of parent location in location popup
        When "school admin" deselects one children location of parent location in location popup
        And "school admin" saves location popup
        Then "school admin" does not see one children location of parent location in location field
        And "school admin" does not see their parent location in location field
        And "school admin" still sees remained children location of parent location in location field

    Scenario Outline: School admin does not see deselected one children location of parent location in detail course page
        Given "school admin" has filled course name
        And "school admin" has selected "<teaching_method>" teaching method
        And "school admin" has opened location popup
        And "school admin" has selected all children location of parent location in location popup
        And "school admin" has deselected one children location of parent location in location popup
        And "school admin" has saved location popup
        When "school admin" creates course
        And "school admin" goes to detail course page under setting tab
        Then "school admin" does not see one children location of parent location in location field
        And "school admin" does not see their parent location in location field
        And "school admin" still sees remained children location of parent location in location field
        Examples:
            | teaching_method |
            | Individual      |
            | Group           |