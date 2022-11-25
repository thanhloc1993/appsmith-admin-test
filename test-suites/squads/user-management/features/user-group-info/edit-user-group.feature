@cms
@user @user-group-info

Feature: Edit user group info

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Edit user group name
        Given school admin has created a user group "<options>"
        When school admin edits user group name
        Then school admin sees the edited user group name "<options>" on CMS
        Examples:
            | options                    |
            | with granted permission    |
            | without granted permission |

    Scenario: Add granted permission to user group
        Given school admin has created a user group "without granted permission"
        When school admin adds new granted permission to user group
        Then school admin sees newly granted permission is added to user group

    Scenario Outline: Edit user group granted role
        Given school admin has created a user group with granted role "<role1>"
        When school admin changes granted role from "<role1>" to "<role2>"
        Then school admin sees granted location of role "<role2>" is "<result>"
        Examples:
            | role1        | role2        | result       |
            | Teacher      | School Admin | organization |
            | School Admin | Teacher      | empty        |

    Scenario: Unable to edit Granted Location for Admin role
        Given school admin has created a user group "with granted permission"
        When school admin edit granted location of role "School Admin"
        Then school admin is unable to edit location

    Scenario Outline: Edit granted location for teacher role
        Given school admin has created a user group "with granted permission"
        When school admin "<action>" some locations for granted location of role "Teacher"
        Then school admin sees granted location of role "Teacher" is updated
        Examples:
            | action  |
            | adds    |
            | removes |

    Scenario Outline: Remove one/all Granted Permission
        Given school admin has created a user group "with granted permission"
        When school admin removes "<option>" granted permission
        Then school admin sees "<option>" granted permission is removed on user group
        Examples:
            | option |
            | one    |
            | all    |
