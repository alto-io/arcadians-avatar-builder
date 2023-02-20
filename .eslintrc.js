module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: ['../common/.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports,
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: '.',
    projectFolderIgnoreList: [
      'node_modules/*',
      'node_modules',
      'dist',
      'build',
      '.yarn',
      'build-utils',
      'docs',
      './src/generated/*',
      'generated/*',
    ],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: [
        '*.jsx', 
        '*.tsx', 
        "*.js",
        "*.ts"
    ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/no-unsafe-return': ['off'],
        '@typescript-eslint/no-unnecessary-type-assertion': ['off'],
        'prefer-const': ['off'],        
        '@typescript-eslint/no-unsafe-argument': ['off'],
        'react/no-unescaped-entities': ['off']
      },
    },
  ],  
};
