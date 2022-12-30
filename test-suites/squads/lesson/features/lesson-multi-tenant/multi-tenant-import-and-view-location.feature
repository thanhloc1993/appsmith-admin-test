@cms @cms2 @cms3 @cms4 @teacher @teacher2
@lesson
@lesson-multi-tenant
@staging

Feature: View imported location with multi-tenant

    Background:
        Given "school admin 1" of "Tenant S1" has logged in CMS
        And "school admin 2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in CMS
        And "teacher T2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in Teacher App
        And "teacher T2" of "Tenant S2" has logged in Teacher App
        And "school admin 1" of "Tenant S1" has imported "location L1"
        And "school admin 2" of "Tenant S2" has imported "location L2"

    Scenario: View imported location in location popup of course on CMS
        When "school admin 1" of "Tenant S1" opens location popup in creating course page on CMS
        And "school admin 2" of "Tenant S2" opens location popup in creating course page on CMS
        Then "school admin 1" of "Tenant S1" sees "location L1" in location popup on CMS
        And "school admin 2" of "Tenant S2" sees "location L2" in location popup on CMS
        And "school admin 1" of "Tenant S1" does not see "location L2" of "Tenant S2" in location popup on CMS
        And "school admin 2" of "Tenant S2" does not see "location L1" of "Tenant S1" in location popup on CMS

    Scenario: View imported location in location settings popup in navigation bar on CMS
        When "school admin 1" of "Tenant S1" opens location setting popup in navigation bar on CMS
        And "school admin 2" of "Tenant S2" opens location setting popup in navigation bar on CMS
        And "teacher T1" of "Tenant S1" opens location setting popup in navigation bar on CMS
        And "teacher T2" of "Tenant S2" opens location setting popup in navigation bar on CMS
        Then "school admin 1" of "Tenant S1" sees "location L1" in location setting popup on CMS
        And "school admin 2" of "Tenant S2" sees "location L2" in location setting popup on CMS
        And "school admin 1" of "Tenant S1" does not see "location L2" of "Tenant S2" in location setting popup on CMS
        And "school admin 2" of "Tenant S2" does not see "location L1" of "Tenant S1" in location setting popup on CMS
        And "teacher T1" of "Tenant S1" sees "location L1" in location setting popup on CMS
        And "teacher T2" of "Tenant S2" sees "location L2" in location setting popup on CMS
        And "teacher T1" of "Tenant S1" does not see "location L2" of "Tenant S2" in location setting popup on CMS
        And "teacher T2" of "Tenant S2" does not see "location L1" of "Tenant S1" in location setting popup on CMS

    Scenario: View imported location in center dropdown list of lesson on CMS
        When "school admin 1" of "Tenant S1" opens center dropdown list in creating lesson page on CMS
        And "school admin 2" of "Tenant S2" opens center dropdown list in creating lesson page on CMS
        And "teacher T1" of "Tenant S1" opens center dropdown list in creating lesson page on CMS
        And "teacher T2" of "Tenant S2" opens center dropdown list in creating lesson page on CMS
        Then "school admin 1" of "Tenant S1" sees "location L1" in center dropdown list on CMS
        And "school admin 2" of "Tenant S2" sees "location L2" in center dropdown list on CMS
        And "school admin 1" of "Tenant S1" does not see "location L2" of "Tenant S2" in center dropdown list on CMS
        And "school admin 2" of "Tenant S2" does not see "location L1" of "Tenant S1" in center dropdown list on CMS
        And "teacher T1" of "Tenant S1" sees "location L1" in center dropdown list on CMS
        And "teacher T2" of "Tenant S2" sees "location L2" in center dropdown list on CMS
        And "teacher T1" of "Tenant T1" does not see "location L2" of "Tenant S2" in center dropdown list on CMS
        And "teacher T2" of "Tenant T2" does not see "location L1" of "Tenant S1" in center dropdown list on CMS

    Scenario: View imported location in location settings popup in navigation bar on Teacher App
        When "teacher T1" of "Tenant S1" opens location setting popup in navigation bar on Teacher App
        And "teacher T2" of "Tenant S2" opens location setting popup in navigation bar on Teacher App
        Then "teacher T1" of "Tenant S1" sees "location L1" in location setting popup on Teacher App
        And "teacher T2" of "Tenant S2" sees "location L2" in location setting popup on Teacher App
        And "teacher T1" of "Tenant S1" does not see "location L2" of "Tenant S2" in location setting popup on Teacher App
        And "teacher T2" of "Tenant S2" does not see "location L1" of "Tenant S1" in location setting popup on Teacher App
