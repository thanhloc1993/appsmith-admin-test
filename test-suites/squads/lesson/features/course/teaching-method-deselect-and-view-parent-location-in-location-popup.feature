@cms
@lesson
@course
@ignore

Feature: School admin can deselect and view parent location
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has opened creating course page
        And "school admin" has opened location popup

    Scenario Outline: School admin can deselect location in location popup
        Given "school admin" has selected parent location in location popup
        When "school admin" deselects "<type1>" location in location popup
        Then "school admin" sees "<type1>" location is in "<mode1>" mode
        And "school admin" sees "<type2>" is in "<mode2>" mode
        And "school admin" does not see parent location in selected field
        And "school admin" does not see all children locations of parent location in selected field
        Examples:
            | type1                  | mode1     | type2                  | mode2     |
            | parent                 | unchecked | all children of parent | unchecked |
            | all children of parent | unchecked | parent                 | unchecked |

    Scenario Outline: School admin does not see deselected parent location in location field
        Given "school admin" has selected parent location in location popup
        When "school admin" deselects "<type1>" location in location popup
        And "school admin" saves location popup
        Then "school admin" does not see parent location in location field
        And "school admin" does not see all children locations of parent location in location field
        Examples:
            | type1                  |
            | parent                 |
            | all children of parent |