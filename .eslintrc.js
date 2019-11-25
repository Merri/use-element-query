module.exports = {
    "extends": "@researchgate/rg-react",
    "parser": "babel-eslint",
    "settings": {
        "import/extensions": [
            ".js",
            ".jsx"
        ],
        "react": {
            "version": "detect"
        }
    },
    "rules": {
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "never",
            "exports": "never",
            "functions": "never"
        }],
        "consistent-return": 0,
        "no-shadow": 0,
        "semi": [
            "error",
            "never"
        ],
        "import/extensions": ["error", "always", { "js": "never", "jsx": "never" }],
        "react/jsx-boolean-value": "never"
    }
}
