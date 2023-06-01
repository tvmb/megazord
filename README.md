MEGAZORD is a simple build tool that enables you to convert componentized blocks of html into static pages. This is accomplished by including special <mz-*> HTML tags in your markup.

## Getting Started

To use, download the latest release from [here](https://github.com/tvmb/megazord/releases/tag/1.0.0). From the command line, you can call the executable with the following options.

```
 -v, --version: Output the current MEGAZORD version
 -i, --init <init>: Generate stub files to location specified.
 -f, --file <file>: File to be processed.
 -d, --dir <dir>: Directory to be processed (should be structured as created by `init` command, with a /pages folder).
 -o, --out <out>: Output directory.
 -v, --version: Output the version number.
 -l, --lang <lang>: Language to be used in processing, eg. "en" or "es". If no language is specified, "en" is assumed.
 -w, --watch: Watch for changes
```

## Quick Start

1. Download the correct executable
2. From the command line type `./{EXECUTABLE_FILE_NAME} --init ./new-project`
3. Take a look at everything under the `/pages`, `/layouts`, `/blocks`, and `/lang` folders inside `./new-project`. 

**NOTE: WHEN USING THE --DIR OPTION, THE HTML FILES IN `/pages` ARE THE ONLY ONES THAT WILL BE PROCESSED AUTOMATICALLY.**

4. To build and output the assembled pages, run `./{EXECUTABLE_FILE_NAME} --watch --dir ./new-project --out ./dist`. This command will listen for any changes to the source files, and then rebuild the output in the `./dist` folder when they are detected.

## MEGAZORD tags

There are 5 speciality MEGAZORD tags, explained below. All `<mz-*>` tags can be either self closed (ie, with />), or just used as an opening tag (eg, `<mz-layout src="...">`)

## `<mz-layout src="...">` 
Only 1 of these tags may be included in a page, and are used to specify a parent template, comparable to the old ASP/.NET Master Pages

## `<mz-content/>`
This tag is only to be used in layouts, and specifies where in the layout the page content should go.

## `<mz-block src="./other-block.html" customName="customValue">`
The block tag will copy the file specificed by the `src` parameter and place its content into the file. Any other parameters will be passed into the included block and can be accessed using an `<mz-var>` tag.

## `<mz-var param="...">`
The var tag is used to display values passed into a block.

## `<mz-translate key="...">`
The tranlsate tag is used (when --lang is specified and a tranlsation file is provided) to switch between values stored in the lang files.


----

MIT License

Copyright (c) 2023 Joseph Cruz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.