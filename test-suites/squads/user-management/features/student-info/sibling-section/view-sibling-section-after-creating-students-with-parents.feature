@cms
@user @sibling

Feature: View sibling section after creating students with parents
    Background:
        Given "school admin" logins CMS

    Scenario Outline: View sibling section after creating students with parents
        When school admin creates "student S1" and "student S2" "<conditions>" same parent
        Then school admin "<expectedConditions>" sibling info in sibling section of student
            | sibling    | student    |
            | student S1 | student S2 |
            | student S2 | student S1 |
        Examples:
            | conditions | expectedConditions |
            | with       | sees               |
            | without    | does not see       |
