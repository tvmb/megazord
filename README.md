MEGAZORD is a simple build tool that enables you to convert componentized blocks of html into static pages. This is accomplished by including special <mz-*> HTML tags in your markup.

## Getting Started

To use, download the latest release from this repo. From the command line, call the executable with the following options.

```
 -v, --version: Output the current MEGAZORD version
 -i, --init <init>: Generate stub files to location
 -f, --file <file>: File to be processed
 -d, --dir <dir>: Directory to be processed (should be structured as created by `init` command, with a /pages folder)
 -o, --out <out>: Output directory
 -v, --version: Output the version number
 -l, --lang <lang>: Language file to be processed, eg. "en" or "es". If no lang is specified, "en" is assumed
 -w, --watch: Watch for changes
```

## Quick Start

1. Download the correct executable
2. From the command line type `./{EXECUTABLE_FILE_NAME} --init ./new-project`
3. Take a look at everything under the `/pages`, `/layouts`, `/blocks`, and `/lang` folders inside `./new-project`. 

- **NOTE: THE HTML FILES IN `/pages` ARE THE ONLY ONES THAT WILL BE PROCESSED. All of the other folders contain files that will be pulled in by each of the HTML files in `/pages`**

4. To build and process the pages, run `./{EXECUTABLE_FILE_NAME} --watch --dir ./new-project --out ./dist`. This command will listen for any changes to the source files, and then rebuild the output in the `./dist` folder when they are detected.

## MEGAZORD tags

There are only 4 speciality MEGAZORD tags, explained below. All `<mz-*>` tags can be either self closed (ie, with />), or just used as an opening tag (eg, `<mz-layout src="...">`)

## `<mz-layout src="...">` 
Only 1 of these tags may be included in a page, and are used to specify a parent template, comparable to the old ASP/.NET Master Pages

## `<mz-block src="./other-block.html" customName="customValue">`
The block tag will copy the file specificed by the `src` parameter and place its content into the file. Any other parameters will be passed into the included block and can be accessed using an `<mz-var>` tag.

## `<mz-var param="...">`
The var tag is used to display values passed into a block.

## `<mz-translate key="...">`
The tranlsate tag is used (when --lang is specified and a tranlsation file is provided) to switch between values stored in the lang files.