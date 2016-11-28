export default parsePayload;

function parsePayload (stringToParse) {
    console.log(stringToParse);
    let isHeader = false;
    let isBody = false;
    let isUrl = true;
    let options = {url: "", method: "", headers: {}, body: {}};

    return parseOptions(stringToParse.split('\n'), isHeader, isBody, isUrl, options);
}


function parseOptions (dataArray, isHeader, isBody, isUrl, options){
    if (isUrl) {
        options = populateUrlAndMethod(options, dataArray.splice(0, 1)[0]);
        isUrl = false;
        if (dataArray[0]) {
            isHeader = true;
        }
        return parseOptions(dataArray, isHeader, isBody, isUrl, options);
    } else if (isHeader) {
        let header = extractHeader(dataArray.splice(0, 1)[0]);
        options.headers[header.key] =  header.value;
        if (!dataArray[0]) {
            isHeader = false;
            isBody = true;
            dataArray.splice(0, 1);
        }
        return parseOptions(dataArray, isHeader, isBody, isUrl, options);
    } else if (isBody) {
        options.body = JSON.parse(dataArray.join(''));
    }
    return options;
}

let extractHeader = (headerString) => {
    let headerArray = headerString.split(': ');
    return {key: headerArray[0], value: headerArray[1]}
};

let populateUrlAndMethod = (options, urlMethodString) => {
    let urlMethodArray = urlMethodString.split(' ');
    options.method = urlMethodArray[0];
    options.url = urlMethodArray[1];
    return options;
};