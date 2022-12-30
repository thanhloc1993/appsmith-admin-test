@cms
@lesson
@course
@ignore

Feature: School admin can deselect and view location
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has opened creating course page

    Scenario Outline: School admin can deselect <type> location of parent location in location popup
        Given "school admin" has opened location popup
        And "school admin" has selected "<type>" location of parent location in location popup
        When "school admin" deselects "<type>" location of parent location in location popup
        Then "school admin" sees "<type>" location is in "<mode1>" mode
        And "school admin" sees their parent location is in "<mode1>" mode
        And "school admin" does not see "<type>" location in selected field
        And "school admin" does not see their parent location in selected field
        Examples:
            | type         | mode1     |
            | one children | unchecked |
            | all children | unchecked |

    Scenario Outline: School admin does not see deselected <type> location in location field
        Given "school admin" has opened location popup
        And "school admin" has selected "<type>" location of parent location in location popup
        When "school admin" deselects "<type>" location of parent location in location popup
        And "school admin" saves location popup
        Then "school admin" does not see "<type>" location in location field
        And "school admin" does not see their parent location in location field
        Examples:
            | type         |
            | one children |
            | all children |

    Scenario Outline: School admin cannot create course when deselected <type> location
        Given "school admin" has filled course name
        And "school admin" has selected "<teaching_method>" teaching method
        And "school admin" has opened location popup
        And "school admin" has selected "<type>" location of parent location in location popup
        And "school admin" deselected "<type>" location of parent location in location popup
        And "school admin" has saved location popup
        When "school admin" creates course
        Then "school admin" sees an inline error message under location field
        And "school admin" is still in creating course page
        Examples:
            | type         | teaching_method |
            | one children | Individual      |
            | all children | Group           |