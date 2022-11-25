@cms @cms2 @learner @learner2 @parent @parent2
@communication
@communication-multi-tenant
@ignore

Feature: Multitenancy create and send notification

    Background:
        Given "school admin Tenant S1" has logged in with tenant on CMS
        And "school admin Tenant S2" has logged in with tenant on CMS
        And "school admin Tenant S1" creates "student Tenant S1" and "parent Tenant S1" for this student
        And "school admin Tenant S2" creates "student Tenant S2" and "parent Tenant S2" for this student
        And "school admin Tenant S1" creates a course "course Tenant S1" for "student Tenant S1"
        And "school admin Tenant S2" creates a course "course Tenant S2" for "student Tenant S2"

    Scenario: Create and send notification to student with all Course and Grade
        Given "school admin Tenant S1" is at "Notification" page with tenant on CMS
        And "school admin Tenant S2" is at "Notification" page with tenant on CMS
        And "student Tenant S1" and "parent Tenant S1" has logged in with "Tenant S1" on Learner Web
        And "student Tenant S2" and "parent Tenant S2" has logged in with "Tenant S2" on Learner Web
        When "school admin Tenant S1" sends notification with All Course and All Grade
        Then "student Tenant S1" "sees" new notification on Learner Web
        And "parent Tenant S1" "sees" new notification on Learner Web
        And "student Tenant S2" "does not see" new notification on Learner Web
        And "parent Tenant S2" "does not see" new notification on Learner Web
        And "school admin Tenant S1" "sees" new notification record in notification table
        And "school admin Tenant S2" "does not see" new notification record in notification table
