// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock axios to prevent "Cannot use import statement outside a module" error
// caused by axios v1.x ESM distribution in Jest environment
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    }
  })),
  defaults: {
    headers: {
      common: {}
    }
  }
}));

// Mock react-compare-slider to prevent Jest resolution issues
// We use a virtual mock because the actual module might not be resolvable by Jest
jest.mock('react-compare-slider', () => ({
  ReactCompareSlider: ({ itemOne, itemTwo }) => <div>{itemOne}{itemTwo}</div>,
  ReactCompareSliderImage: (props) => <img {...props} alt="" />
}), { virtual: true });
