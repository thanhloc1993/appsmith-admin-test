@cms @cms2 @teacher @teacher2
@lesson
@lesson-multi-tenant
@staging

Feature: Create course and view detail with multi-tenant

    Background:
        Given "school admin 1" of "Tenant S1" has logged in CMS
        And "school admin 2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in Teacher App
        And "teacher T2" of "Tenant S2" has logged in Teacher App

    Scenario: Create course without location with multi-tenant
        When "school admin 1" of "Tenant S1" creates a "course C1" without location on CMS
        And "school admin 2" of "Tenant S2" creates a "course C2" without location on CMS
        Then "school admin 1" of "Tenant S1" sees newly "course C1" on CMS
        And "school admin 2" of "Tenant S2" sees newly "course C2" on CMS
        And "school admin 1" of "Tenant S1" does not see newly "course C2" on CMS
        And "school admin 2" of "Tenant S2" does not see newly "course C1" on CMS
        And "teacher T1" of "Tenant S1" sees newly "course C1" on Teacher App
        And "teacher T2" of "Tenant S2" sees newly "course C2" on Teacher App
        And "teacher T1" of "Tenant S1" does not see newly "course C2" on Teacher App
        And "teacher T2" of "Tenant S2" does not see newly "course C1" on Teacher App

    Scenario: Cannot view detail of course without location with multi-tenant by URL
        When "school admin 1" of "Tenant S1" creates a "course C1" without location on CMS
        And "school admin 2" of "Tenant S2" creates a "course C2" without location on CMS
        And "school admin 1" of "Tenant S1" views detail of "course C2" by URL on CMS
        And "school admin 2" of "Tenant S2" views detail of "course C1" by URL on CMS
        And "teacher T1" of "Tenant S1" views detail of "course C2" by URL on Teacher App
        And "teacher T2" of "Tenant S2" views detail of "course C1" by URL on Teacher App
        Then "school admin 1" of "Tenant S1" does not see detail of "course C2"
        And "school admin 2" of "Tenant S2" does not see detail of "course C1"
        And "teacher T1" of "Tenant S1" does not see detail of "course C2" on Teacher App
        And "teacher T2" of "Tenant S2" does not see detail of "course C1" on Teacher App

    Scenario Outline: Create course with location and multi-tenant
        When "school admin 1" of "Tenant S1" creates a "course C1" with "<type>" on CMS
        And "school admin 2" of "Tenant S2" creates a "course C2" with "<type>" on CMS
        Then "school admin 1" of "Tenant S1" sees newly "course C1" on CMS
        And "school admin 2" of "Tenant S2" sees newly "course C2" on CMS
        And "school admin 1" of "Tenant S1" does not see newly "course C2" on CMS
        And "school admin 2" of "Tenant S2" does not see newly "course C1" on CMS
        And "teacher T1" of "Tenant S1" sees newly "course C1" on Teacher App
        And "teacher T2" of "Tenant S2" sees newly "course C2" on Teacher App
        And "teacher T1" of "Tenant S1" does not see newly "course C2" on Teacher App
        And "teacher T2" of "Tenant S2" does not see newly "course C1" on Teacher App
        Examples:
            | type       |
            | one child  |
            | one parent |

    Scenario Outline: Cannot view detail of course with location and multi-tenant by URL
        When "school admin 1" of "Tenant S1" creates a "course C1" with "<type>" on CMS
        And "school admin 2" of "Tenant S2" creates a "course C2" with "<type>" on CMS
        And "school admin 1" of "Tenant S1" views detail of "course C2" by URL on CMS
        And "school admin 2" of "Tenant S2" views detail of "course C1" by URL on CMS
        And "teacher T1" of "Tenant S1" views detail of "course C2" by URL on Teacher App
        And "teacher T2" of "Tenant S2" views detail of "course C1" by URL on Teacher App
        Then "school admin 1" of "Tenant S1" does not see detail of "course C2"
        And "school admin 2" of "Tenant S2" does not see detail of "course C1"
        And "teacher T1" of "Tenant S1" does not see detail of "course C2" on Teacher App
        And "teacher T2" of "Tenant S2" does not see detail of "course C1" on Teacher App
        Examples:
            | type       |
            | one child  |
            | one parent |
