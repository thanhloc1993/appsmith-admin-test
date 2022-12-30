@cms @cms2 @cms3 @cms4
@lesson
@lesson-multi-tenant
@staging

Feature: Teacher submits and saves draft lesson report with multi-tenant

    Background:
        Given "school admin 1" of "Tenant S1" has logged in CMS
        And "school admin 2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in CMS
        And "teacher T2" of "Tenant S2" has logged in CMS

    Scenario Outline: Teacher submits lesson report with multi-tenant
        Given "school admin 1" of "Tenant S1" has created a "<type>" online "lesson L1" with "teacher T1" on CMS
        And "school admin 2" of "Tenant S2" has created a "<type>" online "lesson L2" with "teacher T2" on CMS
        When "teacher T1" of "Tenant S1" submits individual lesson report for "<type>" online "lesson L1" on CMS
        And "teacher T2" of "Tenant S2" submits individual lesson report for "<type>" online "lesson L2" on CMS
        Then "teacher T1" of "Tenant S1" sees "Submitted" lesson report of "<type>" online "lesson L1" on CMS
        And "teacher T2" of "Tenant S2" sees "Submitted" lesson report of "<type>" online "lesson L2" on CMS
        And "teacher T1" of "Tenant S1" does not see "Submitted" lesson report of "<type>" online "lesson L2" on CMS
        And "teacher T2" of "Tenant S2" does not see "Submitted" lesson report of "<type>" online "lesson L1" on CMS
        And "school admin 1" of "Tenant S1" sees "Submitted" lesson report of "<type>" online "lesson L1" on CMS
        And "school admin 2" of "Tenant S2" sees "Submitted" lesson report of "<type>" online "lesson L2" on CMS
        And "school admin 1" of "Tenant S1" does not see "Submitted" lesson report of "<type>" online "lesson L2" on CMS
        And "school admin 2" of "Tenant S2" does not see "Submitted" lesson report of "<type>" online "lesson L1" on CMS
        Examples:
            | type   |
            | future |
            | past   |

    Scenario Outline: Teacher saves draft lesson report with multi-tenant
        Given "school admin 1" of "Tenant S1" has created a "<type>" online "lesson L1" with "teacher T1" on CMS
        And "school admin 2" of "Tenant S2" has created a "<type>" online "lesson L2" with "teacher T2" on CMS
        When "teacher T1" of "Tenant S1" saves draft individual lesson report for "<type>" online "lesson L1" on CMS
        And "teacher T2" of "Tenant S2" saves draft individual lesson report for "<type>" online "lesson L2" on CMS
        Then "teacher T1" of "Tenant S1" sees "Draft" lesson report of "<type>" online "lesson L1" on CMS
        And "teacher T2" of "Tenant S2" sees "Draft" lesson report of "<type>" online "lesson L2" on CMS
        And "teacher T1" of "Tenant S1" does not see "Draft" lesson report of "<type>" online "lesson L2" on CMS
        And "teacher T2" of "Tenant S2" does not see "Draft" lesson report of "<type>" online "lesson L1" on CMS
        And "school admin 1" of "Tenant S1" sees "Draft" lesson report of "<type>" online "lesson L1" on CMS
        And "school admin 2" of "Tenant S2" sees "Draft" lesson report of "<type>" online "lesson L2" on CMS
        And "school admin 1" of "Tenant S1" does not see "Draft" lesson report of "<type>" online "lesson L2" on CMS
        And "school admin 2" of "Tenant S2" does not see "Draft" lesson report of "<type>" online "lesson L1" on CMS
        Examples:
            | type   |
            | future |
            | past   |
