module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@integrations/(.*)$': '<rootDir>/src/integrations/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
  },
};
