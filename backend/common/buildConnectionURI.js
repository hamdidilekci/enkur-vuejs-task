
const buildConnectionURI = ({
    protocol = "mongodb",
    host,
    port,
    user,
    pass,
    name,
    options = {}}) => {
        
    let connectionString = `${protocol}://`;

    if (user && pass) {
        connectionString += `${user}:${pass}@`;
    }

    connectionString += host;

    if (protocol !== "mongodb+srv" && port) {
        connectionString += `:${port}`;
    }

    if (name) {
        connectionString += `/${name}`;
    }

    if (Object.keys(options).length > 0) {
        connectionString += "?";
        connectionString += Object.keys(options)
            .map((k) => [k, options[k]].join("="))
            .join("&");
    }

    return connectionString;
};

export default buildConnectionURI;
