import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Increase the default timeout
configure({ asyncUtilTimeout: 5000 }); 