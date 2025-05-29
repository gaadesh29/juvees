// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Increase the default timeout
configure({ asyncUtilTimeout: 5000 }); 