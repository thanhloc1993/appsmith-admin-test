@cms @cms2
@syllabus @staging @syllabus-multi-tenant

Feature: School admin duplicates book with multi tenant
        Background:
                Given "school admin Tenant S1" has logged in with tenant on CMS
                And "school admin Tenant S2" has logged in with tenant on CMS
                And "school admin Tenant S1" has created a "simple content without quiz" "book 1"
                And "school admin Tenant S2" has created a "simple content without quiz" "book 2"

        Scenario: school admins cannot see other tenant duplicated book content
                When "school admin Tenant S1" duplicates "book 1" to "book 1\'"
                And "school admin Tenant S2" duplicates "book 2" to "book 2\'"
                Then "school admin Tenant S1" doesn't see "book 2\'"
                And "school admin Tenant S2" doesn't see "book 1\'"
                And "school admin Tenant S1" sees "book 1\'"
                And "school admin Tenant S2" sees "book 2\'"
                And "school admin Tenant S1" sees 404 error page when access "book 2\'" by url
                And "school admin Tenant S1" sees 404 error page when access "book 2\'" content by url
                And "school admin Tenant S2" sees 404 error page when access "book 1\'" by url
                And "school admin Tenant S2" sees 404 error page when access "book 1\'" content by url