@cms
@user @sibling

Feature: View siblings info of students with multiple parents

    Background:
        Given "school admin" logins CMS

    Scenario: View siblings info of students with multiple parents on CMS
        When school admin creates new students with multiple parents info
            | student    | parents               |
            | student S1 | parent P1 & parent P2 |
            | student S2 | parent P2 & parent P3 |
            | student S3 | parent P1 & parent P3 |
        Then school admin sees siblings info of the student is displayed correctly
            | student    | siblings                |
            | student S1 | student S2 & student S3 |
            | student S2 | student S1 & student S3 |
            | student S3 | student S1 & student S2 |
