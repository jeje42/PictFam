module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    plugins: ['react-hooks', 'no-null'],
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react|
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescriIpt-eslint/eslint-plugin
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/array-type': [
            'error',
            {
                default: 'array',
            },
        ],
        'react/prop-types': 'off',
        // '@typescript-eslint/naming-convention': [
        //     // More details here: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
        //     'error',
        //     {
        //         selector: 'variableLike',
        //         format: ['camelCase'],
        //         filter: {
        //             regex: '(.+FC)|_',
        //             match: false,
        //         },
        //     },
        //     {
        //         selector: 'variableLike',
        //         format: ['PascalCase'],
        //         filter: {
        //             regex: '(.+FC)&(?!_)',
        //             match: true,
        //         },
        //     },
        //     {
        //         selector: 'enum',
        //         format: ['PascalCase'],
        //     },
        //     {
        //         selector: 'enumMember',
        //         format: ['PascalCase'],
        //     },
        //     {
        //         selector: 'interface',
        //         format: ['PascalCase'],
        //     },
        //     {
        //         selector: 'class',
        //         format: ['PascalCase'],
        //     },
        // ],
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',

        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/destructuring-assignment': 'off',
        'no-null/no-null': 'warn',  // Only warn, compatibility problem with react-scripts. Support from core eslint may be added
        'prefer-template': 'error',
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};