@cms
@lesson
@lesson-location-settings-cms

Feature: School admin can select and view location in location setting
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to lesson management page
        And "school admin" has open location settings in nav bar on CMS

    Scenario Outline: School admin can select children location in location setting
        When "school admin" selects "<type>" location of parent location in location setting
        Then "school admin" sees "<type>" location is in checked mode
        And "school admin" sees their parent location is in indeterminate mode
        And "school admin" sees org location is in indeterminate mode
        And "school admin" sees "<type>" location in selected field
        And "school admin" does not see their parent location in selected field
        And "school admin" does not see org location in selected field
        Examples:
            | type         |
            | one child    |
            | all children |

    Scenario Outline: School admin can select parent location in location setting
        When "school admin" selects "<type>" location in location setting
        Then "school admin" sees "<type>" location is in checked mode
        And "school admin" sees "<type>" children location is in checked mode
        And "school admin" sees org location is in indeterminate mode
        And "school admin" sees "<type>" location in selected field
        And "school admin" does not see "<type>" children location in selected field
        And "school admin" does not see org location in selected field
        Examples:
            | type        |
            | one parent  |
            | all parents |

    Scenario: School admin can select org location in location setting
        When "school admin" selects org location in location setting
        Then "school admin" sees org location is in checked mode
        And "school admin" sees all children of org locations is in checked mode
        And "school admin" sees all parent of org locations is in checked mode
        And "school admin" sees org location in selected field
        And "school admin" does not see children location of org location in selected field
        And "school admin" does not see parent location of org location in selected field
