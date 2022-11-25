import withMessage from './with-message';
import expect from 'expect';

global.weExpect = withMessage(expect);

export default withMessage;
