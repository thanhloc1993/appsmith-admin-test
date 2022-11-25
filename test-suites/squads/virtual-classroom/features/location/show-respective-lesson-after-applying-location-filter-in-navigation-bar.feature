@cms @teacher
@virtual-classroom
@virtual-classroom-location-settings-teacher-app
@ignore

Feature: Showing only respective lesson under course after applying location filter in navigation bar
    #refactor later
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created course with 2 locations
        And school admin has created a "lesson L1" with "location L1" with start date&time is within 10 minutes from now
        And school admin has created a "lesson L2" with "location L2" with start date&time is within 10 minutes from now

    Scenario: Teacher cannot see the lesson when teacher applies child location which is not as lesson location
        When "teacher" applies "location L1" in location settings
        And "teacher" goes to course detail screen
        Then "teacher" does not see the "lesson L2" on Teacher App
        And  "teacher" sees the "lesson L1" on Teacher App

    Scenario: Teacher cannot see the lesson when teacher applies parent location which do not have lesson location
        When "teacher" applies one parent location which do not have "location L1" in location settings
        And "teacher" goes to course detail screen
        Then "teacher" does not see the "lesson L1" on Teacher App

    Scenario: Teacher will see the lesson when teacher applies one child lesson location in location settings
        Given "teacher" has applied "location L1" in location settings
        And "teacher" has gone to course detail screen
        When "teacher" confirms removing "location L1" and applying "location L2" in location settings
        Then "teacher" is redirected to the course list page on Teacher App
        And "teacher" goes to course detail screen again
        And "teacher" sees the "lesson L2" on Teacher App
        And "teacher" does not see the "lesson L1" on Teacher App

# Temporary ignore this scenario since it's technical limit, always timeout for scrollUntilVisible
# because too many locations

# Scenario: Teacher will see the lesson when teacher applies one parent location which includes lesson location
#     Given "teacher" has applied one parent location which do not have "location L1" in location settings
#     And "teacher" has gone to course detail screen
#     When "teacher" confirms applying one parent location which includes "location L1" in location settings
#     Then "teacher" is redirected to the course list page on Teacher App
#     And "teacher" goes to course detail screen again
#     And "teacher" sees the "lesson L1" on Teacher App