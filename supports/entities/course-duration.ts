///  Examples:
// | condition                              | result       |
// | start date <= current date <= end date | sees         |
// | start date > current date              | does not see |
// | end date < current date                | does not see |
export type CourseDuration =
    | 'start date <= current date <= end date'
    | 'start date > current date'
    | 'end date < current date'
    | 'start date = end date = current date'
    | 'start date = end date > current date'
    | 'start date = end date < current date';
