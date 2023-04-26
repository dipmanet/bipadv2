import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

import raf from './tempPolyfills'; // eslint-disable-line no-unused-vars

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

jest.mock('mapbox-gl', () => undefined);

/*
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
*/
