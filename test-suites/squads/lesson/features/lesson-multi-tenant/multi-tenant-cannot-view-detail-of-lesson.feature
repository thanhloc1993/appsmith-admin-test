@cms @cms2 @cms3 @cms4 @teacher @teacher2
@lesson
@lesson-multi-tenant
@staging

Feature: Cannot view detail of lesson by URL with multi-tenant

    Background:
        Given "school admin 1" of "Tenant S1" has logged in CMS
        And "school admin 2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in CMS
        And "teacher T2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in Teacher App with available account
        And "teacher T2" of "Tenant S2" has logged in Teacher App with available account

    Scenario Outline: Cannot view detail of online <type> lesson by URL with multi-tenant
        When "school admin 1" of "Tenant S1" creates a "<type>" online "lesson L1" with "teacher T1" on CMS
        And "school admin 2" of "Tenant S2" creates a "<type>" online "lesson L2" with "teacher T2" on CMS
        And "school admin 1" of "Tenant S1" views detail of "<type>" online "lesson L2" by URL on CMS
        And "school admin 2" of "Tenant S2" views detail of "<type>" online "lesson L1" by URL on CMS
        And "teacher T1" of "Tenant S1" views detail of "<type>" online "lesson L2" by URL on CMS
        And "teacher T2" of "Tenant S2" views detail of "<type>" online "lesson L1" by URL on CMS
        And "teacher T1" of "Tenant S1" views detail of "<type>" online "lesson L2" by URL on Teacher App
        And "teacher T2" of "Tenant S2" views detail of "<type>" online "lesson L1" by URL on Teacher App
        Then "school admin 1" of "Tenant S1" sees error 404 on CMS
        And "school admin 2" of "Tenant S2" sees error 404 on CMS
        And "teacher T1" of "Tenant S1" sees error 404 on CMS
        And "teacher T2" of "Tenant S2" sees error 404 on CMS
        And "teacher T1" of "Tenant S1" sees error 404 on Teacher App
        And "teacher T2" of "Tenant S2" sees error 404 on Teacher App
        Examples:
            | type   |
            | future |
            | past   |
