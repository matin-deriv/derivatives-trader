const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '@deriv/utils': '<rootDir>/../../__mocks__/utils.mock.js',
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '@deriv-com/translations': '<rootDir>/../../__mocks__/translation.mock.js',
        '@deriv-com/ui': '<rootDir>/../../__mocks__/deriv-com.ui.mock.js',
        '^_common/(.*)$': '<rootDir>/src/_common/$1',
        '^App/(.*)$': '<rootDir>/src/App/$1',
        '^Assets/(.*)$': '<rootDir>/src/Assets/$1',
        '^Constants/(.*)$': '<rootDir>/src/Constants/$1',
        '^Constants$': '<rootDir>/src/Constants/index.js',
        '^Documents/(.*)$': '<rootDir>/src/Documents/$1',
        '^Modules/(.*)$': '<rootDir>/src/Modules/$1',
        '^Utils/(.*)$': '<rootDir>/src/Utils/$1',
        '^Services/(.*)$': '<rootDir>/src/Services/$1',
        '^Services$': '<rootDir>/src/Services/index.js',
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1',
    },
};
