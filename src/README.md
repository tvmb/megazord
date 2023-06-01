MEGAZORD is a simple build tool that enables you to convert componentized blocks of html into static pages. This is accomplished by including special `<mz-*>` HTML tags in your markup, similar to classic ASP/ASP.NET Forms pages.

# Getting Started

To use, install using npm. 

```
npm i -g mzord
```

From the command line, you can call the executable with the following options.

```
 -i, --init <init>: Generate skeleton files to location specified.
 -f, --file <file>: File to be processed.
 -d, --dir <dir>: Directory to be processed (should be structured as created by `init` command, with a /pages folder).
 -o, --out <out>: Output directory.
 -w, --watch: Watch for changes
 -l, --lang <lang>: Language to be used in processing, eg. "en" or "es". If no language is specified, "en" is assumed.
 -v, --version: Output the current MEGAZORD version
```

# Quick Start

1. Install using `npm` as show above
2. From the command line type `mzord --init ./new-project`
3. Take a look at everything under the `/pages`, `/layouts`, `/blocks`, and `/lang` folders inside `./new-project`. 

**NOTE: WHEN USING THE --DIR OPTION, THE HTML FILES IN `/pages` ARE THE ONLY ONES THAT WILL BE PROCESSED AUTOMATICALLY.**

4. To build and output the assembled pages, run `./mzord --watch --dir ./new-project --out ./dist`. This command will listen for any changes to the source files, and then rebuild the output in the `./dist` folder when they are detected.

# MEGAZORD tags

There are 5 speciality MEGAZORD tags, explained below. All `<mz-*>` tags can be either self closed (ie, with />), or just used as an opening tag (eg, `<mz-layout src="...">`)

## `<mz-layout src="...">` 
Only 1 of these tags may be included in a page, and are used to specify a parent template, comparable to the old ASP/.NET Master Pages

## `<mz-content>`
This tag is only to be used in layouts, and specifies where in the layout the page content should go.

## `<mz-block src="./other-block.html" customName="customValue">`
The block tag will copy the file specificed by the `src` parameter and place its content into the file. Any other parameters will be passed into the included block and can be accessed using an `<mz-var>` tag.

## `<mz-var param="...">`
The var tag is used to display values passed into a block.

## `<mz-translate key="...">`
The tranlsate tag is used (when --lang is specified and a tranlsation file is provided) to switch between values stored in the lang files. The value given in the `key` prop must match the string of the identifier in the lang.json file. 

# Pages vs. Layouts vs. Blocks
**Pages** - Pages are the primary holders of your HTML. As an example, for a website with three pages (Home, About, Contact Us), there should be three page files (home.html, about.html, contact.html). Pages can specify a single `<mz-layout>` tag, and can include many `<mz-block>` and `<mz-translate>` tags.

**Layouts** - Layouts can be used to hold shared wrapper code that is used across pages. Only one layout tag can be used per page. They generally hold the boilerplate structure of your site, ie. `<html>`, `<head>`, and `<body>` tags. Layouts use the special `<mz-content>` tag to specify where the calling page's content will go. Layouts can also include `<mz-block>` and `<mz-translate>` tags.

**Blocks** - Blocks are re-usable snippets of HTML that can be included in Layouts, Pages, or even other Blocks. Any parameters passed into a `<mz-block>` tag can be accessed within the block HTML by using an `<mz-var>` tag.

# FAQ
- _Can I use a header.html and footer.html block in my pages instead of using an `<mz-layout>` tag and layout file?_  
**- Yep!**

- _Are translation files required?_  
**- No, they are not required. If you do not specify a language file, but include `<mz-translate>` tags in your markup, they will simply be removed during processing.**



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