@cms
@architecture
@course

Feature: School admin can select and view location in location popup
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has opened creating course page
        And "school admin" has filled course name
        And "school admin" has opened location popup

    Scenario Outline: School admin can select <location_level> location of parent location in location popup
        When "school admin" selects "<location_level>" location of parent location in location popup
        Then "school admin" sees "<location_level>" location is in checked mode in Course
        And "school admin" sees their parent location of "<location_level>" is in "<mode>" mode
        And "school admin" sees "<location_level>" location in selected field in Course
        And "school admin" does not see parent location of "<location_level>" in selected field in Course
        Examples:
            | location_level | mode          |
            | one child      | indeterminate |
            | all children   | checked       |

    Scenario Outline: School admin can view selected <location_level> location in location field
        When "school admin" selects "<location_level>" location of parent location in location popup
        And "school admin" saves selected location in location popup
        Then "school admin" sees "<location_level>" location in location field
        And "school admin" does not see their parent location of "<location_level>" in location field
        Examples:
            | location_level |
            | one child      |
            | all children   |

    Scenario Outline: School admin can view selected <location_level> location in detail course page
        When "school admin" selects "<location_level>" location of parent location in location popup
        And "school admin" saves selected location in location popup
        And "school admin" creates a new course
        And "school admin" goes to detail course page under setting tab
        Then "school admin" sees "<location_level>" in location field in detail course page
        And "school admin" does not see their parent location of "<location_level>" in detail course page
        Examples:
            | location_level |
            | one child      |
            | all children   |
