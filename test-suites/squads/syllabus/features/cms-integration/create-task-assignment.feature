@cms
@cms-syllabus-integration
@syllabus @task-assignment

Feature: [Integration] School admin creates task assignment
    Background:
        Given "school admin" logins CMS
        And school admin is at book page
        And school admin has created a "has chapter and topic only" book
        And school admin is at book detail page

    #TCID:syl-0884,syl-0885,syl-0886,syl-0887,syl-0888
    Scenario Outline: School admin creates a task assignment
        When school admin creates a task assignment with "<field>"
        Then school admin sees message "You have created a new task successfully"
        And school admin sees "<field>" on created task assignment
        And school admin sees a new task assignment on CMS

        Examples:
            | field             |
            | description       |
            | no description    |
            | no attachments    |
            | no required items |
            | any required item |

    #TCID:syl-0961
    Scenario Outline:  School admin cannot create task assignment with missing <field>
        When school admin creates a task assignment with missing "<field>"
        Then school admin cannot create any task assignment

        Examples:
            | field |
            | name  |
