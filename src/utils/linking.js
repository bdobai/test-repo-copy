const config = {
    Social: 'event/:1'
};

const linking = {
    prefixes: ["chapp://, 'https://www.chapp.com", 'https://chappapp-admin.mejix.com'],
    config,
    getStateFromPath: (path, options) => {
        console.log(path, options)
        // Return a state object here
        // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
    },
    getPathFromState(state, config) {
        console.log(state, config)
        // Return a path string here
        // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
    },
};

export default linking;
