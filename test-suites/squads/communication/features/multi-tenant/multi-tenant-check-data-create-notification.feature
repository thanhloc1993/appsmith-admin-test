@cms @cms2
@communication
@communication-multi-tenant

Feature: Multi tenant check data create notification

    Background:
        Given "school admin Tenant S1" has logged in with tenant on CMS
        And "school admin Tenant S2" has logged in with tenant on CMS
        And "school admin Tenant S1" has created "student Tenant S1"
        And "school admin Tenant S2" has created "student Tenant S2"
        And "school admin Tenant S1" creates a course "course Tenant S1" for "student Tenant S1"
        And "school admin Tenant S2" creates a course "course Tenant S2" for "student Tenant S2"
        And "school admin Tenant S1" opens compose dialog

    Scenario Outline: Check individual recipient who <caseOfScenario> to tenant
        When "school admin Tenant S1" search name of "<learnerRolesWithTenant>" at individual recipient
        Then "school admin Tenant S1" "<action>" "<learnerRolesWithTenant>" at individual recipient
        Examples:
            | caseOfScenario  | action       | learnerRolesWithTenant |
            | belong          | sees         | student Tenant S1      |
            | does not belong | does not see | student Tenant S2      |

    Scenario Outline: Check course <caseOfScenario> to Tenant at select Course
        When "school admin Tenant S1" search "<courseWithTenant>" at select course
        Then "school admin Tenant S1" "<action>" "<courseWithTenant>" at select course
        Examples:
            | caseOfScenario  | action       | courseWithTenant |
            | belong          | sees         | course Tenant S1 |
            | does not belong | does not see | course Tenant S2 |
