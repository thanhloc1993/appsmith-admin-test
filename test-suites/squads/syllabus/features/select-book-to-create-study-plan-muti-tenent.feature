@cms @cms2
@syllabus @staging @syllabus-multi-tenant

Feature: (Multi tenants) School admin selects books to create study plan
        Background:
                Given "school admin Tenant S1" has logged in with tenant on CMS
                And "school admin Tenant S2" has logged in with tenant on CMS
                And "school admin Tenant S1" creates a course "course Tenant S1"
                And "school admin Tenant S2" creates a course "course Tenant S2"

        Scenario: School admin can only see books in the same tenant with them
                When "school admin Tenant S1" has created a "simple content without quiz" "book 1a"
                And "school admin Tenant S1" has created a "simple content without quiz" "book 1b"
                And "school admin Tenant S2" has created a "simple content without quiz" "book 2a"
                And "school admin Tenant S2" has created a "simple content without quiz" "book 2b"
                Then "school admin Tenant S1" can see "book 1a" when creating study plan
                And "school admin Tenant S1" can see "book 1b" when creating study plan
                And "school admin Tenant S2" can see "book 2a" when creating study plan
                And "school admin Tenant S2" can see "book 2b" when creating study plan
                And "school admin Tenant S1" cannot see "book 2a" when creating study plan
                And "school admin Tenant S1" cannot see "book 2b" when creating study plan
                And "school admin Tenant S2" cannot see "book 1a" when creating study plan
                And "school admin Tenant S2" cannot see "book 1b" when creating study plan
