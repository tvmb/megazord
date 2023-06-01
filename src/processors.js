const fs = require('fs');
const path = require("path");
const chalk = require("chalk");

/**
 * Process all layout tags
 * 
 * @param {string} currentDirectory 
 * @param {string} content 
 * 
 * @returns string
 */
function processLayoutTags(currentDirectory, content) {
    // search for all <mz-layout> tags
    const layoutPageRegex = /<mz-layout(.*?)src=["'](.*?)["'](.*?)\/*>/g;
    const layoutPageMatches = [...content.matchAll(layoutPageRegex)];

    console.log(chalk.yellow.bold(`      (${layoutPageMatches.length}) layout tags found.`));

    // if no mz-layout tags are found, bail.
    if (layoutPageMatches.length <= 0) {
        return content;
    }

    // remove all <mz-layout> tags
    content = content.replace(layoutPageRegex, "");

    // get the first mz-layout tag, and swap in this page's content into the layout file text placeholder
    const layoutPage = layoutPageMatches[0][2];
    const layoutContent = fs.readFileSync(path.resolve(currentDirectory, layoutPage), "utf8");

    content = layoutContent.replace(/<mz-content.*?>/g, content);

    return content;
}

/**
 * Process all var tags
 * 
 * @param {string} content 
 * @param {string} paramString 
 * 
 * @returns string
 */
function processVarTags(content, paramString) {

    // search for <mz-var> and replace with the value from the <mz-block> tag
    const paramRegex = /<mz-var *?param *?= *?['"]([a-zA-Z0-9]*?)['"].*?>/g;
    const paramMatches = [...content.matchAll(paramRegex)];

    if ( paramMatches.length <= 0 ) {
        return content;
    }

    paramMatches.forEach(paramMatch => {
        const paramName = paramMatch[1];

        // get all instance of key="value" in paramString via regex
        const paramStringRegex = /([a-zA-Z0-9]*?)=["'](.*?)["']/g;
        const paramStringMatches = [...paramString.matchAll(paramStringRegex)];

        // if no matches, remove the mz-var tag
        if (paramStringMatches.length <= 0) {
            content = content.replace(paramMatch[0], "");
            return;
        }

        // find the value of the key we are looking for
        const params = paramStringMatches.filter(param => param[1] === paramName);

        // if no matches, remove the mz-var tag
        if (params.length <= 0) {
            content = content.replace(paramMatch[0], "");
            return;
        }

        content = content.replace(paramMatch[0], params[0][2]);

    });

    return content;
}

/**
 * Process all include tags
 * 
 * @param {string} currentDirectory 
 * @param {string} content 
 * 
 * @returns string
 */
function processIncludeTags(currentDirectory, content) {
    // search for all <mz-block> tags
    const includeRegex = /<mz-block(.*?)src=["'](.+?)["'](.*?)\/*>/g;
    const includeMatches = [...content.matchAll(includeRegex)];

    console.log(chalk.yellow.bold(`      (${includeMatches.length}) include tags found.`));

    // if no mz-block tags are found, bail.
    if (includeMatches.length <= 0) {
        content = content.replace(includeRegex, "");
        return content;
    }

    // swap all <mz-block> tags with the content of the file
    includeMatches.forEach(match => {
        const includeFile = match[2];
        let includeContent = fs.readFileSync(path.resolve(currentDirectory, includeFile), "utf8");
        content = content.replace(match[0], processVarTags(includeContent, match[0] + " " + match[2]));
    });

    return content;
}

/**
 * Process all translation tags
 * 
 * @param {object} options
 * @param {string} currentDirectory 
 * @param {string} content 
 * 
 * @returns string
 */
function processTranslateTags(options, currentDirectory, content) {
    // check if the language file exists
    const langFileName = options.lang + ".lang.json";
    const langFile = path.resolve(currentDirectory, path.join( "../lang", langFileName ) );

    if (!fs.existsSync(langFile)) {
        if ( !options.langAdded ) {
            content = content.replace(/<mz-translate.*?>/g, "");
            console.log(chalk.red(`-- Error: language file ${options.lang} not found.`));
        }
        return content;
    }

    // read the language file
    const langContent = JSON.parse(fs.readFileSync(langFile, "utf8"));

    // search for all <mz-translate> tags
    const stringRegex = /<mz-translate *?key *?= *?["']([a-zA-Z]*?)["'].*?>/g;
    const stringMatches = [...content.matchAll(stringRegex)];

    console.log(chalk.yellow.bold(`      (${stringMatches.length}) translation tags found.`));

    // if no mz-translate tags are found, bail.
    if (stringMatches.length <= 0) {
        content = content.replace(stringRegex, "");
        return content;
    }

    // swap all <mz-translate> tags with the content of the file
    stringMatches.forEach(match => {
        const stringName = match[1];
        let stringContent = langContent[stringName];

        // if the string is not found in the language file, replace with the string name
        if (!stringContent) {
            console.log(chalk.yellow.bold(`-- Warning: String "${stringName}" not found in language file ${options.lang}.`) );
            stringContent = stringName;
        }

        // replace the tag with the string content
        content = content.replace(match[0], stringContent);
    });

    return content;
}

/**
 * Process individual file
 * 
 * @param {string} file 
 * @param {object} options
 * @param {string} outputDirectory 
 */
function processFile(file, options, outputDirectory) {
    console.log(chalk.green.bold(" -- Processing file: " + file));

    // read content from file
    let content = fs.readFileSync(file, "utf8");

    // get current folder of file
    const currentDirectory = path.dirname(file);

    // process all <mz-layout> tags
    console.log(chalk.green.bold(" ---- Processing layout tags."));
    content = processLayoutTags(currentDirectory, content);

    // process all <mz-block> tags
    console.log(chalk.green.bold(" ---- Processing include tags."));
    content = processIncludeTags(currentDirectory, content);

    // if language file is specified, process all @@translate tags
    if (options.lang) {
        console.log(chalk.green.bold(" ---- Processing translation tags."));
        content = processTranslateTags(options, currentDirectory, content);
    }

    // check if output directory exists, if not, create it
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }

    const separator = process.platform === "win32" ? "\\" : "/";

    // get the page name and remove the extensions
    let newFileName = file.split(separator).reverse()[0].replace(".html", "");

    // if language file is specified, add the language to the file name
    if (options.lang) {
        newFileName += `.${options.lang.split(separator).reverse()[0].split('.')[0]}`;
    }

    // add the html extension
    newFileName += ".html";

    console.log(chalk.bgGreen(" ** Processing " + file + " complete, saving file as " + newFileName + "\n\n"));

    // write the output file
    fs.writeFileSync(path.resolve(`${outputDirectory}${separator}${newFileName}`), content);
}

/**
 * Process all files in a directory
 * 
 * @param {string} directory 
 * @param {object} options
 * @param {string} outputDirectory 
 * @returns 
 */
function processDirectory(directory, options, outputDirectory) {
    let files = [];

    // check if directory exists
    const dr = fs.readdirSync(path.join(directory, 'pages'));

    console.log(chalk.green.bold(" -- Processing directory: " + directory + "\n"));

    // filter out all non-page files
    files = [...dr].filter(file => file.endsWith(".html"));

    if (files.length === 0) {
        console.log(chalk.red.bold("-- Error: No page files found in directory."));
        return process.exit(1);
    }

    // process all files
    files.forEach(file => processFile(path.join(directory, 'pages', file), options, outputDirectory));
}

module.exports = { processDirectory, processFile };