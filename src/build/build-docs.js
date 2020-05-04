#!/usr/bin/env node-esm

// node-esm is just a shell script with: `node -r esm "$@"`

import Promise from 'bluebird';
import cherio from 'cherio';
import fs from 'fs';

const fs_read = Promise.promisify(fs.readFile);

async function main()
{
    const out = [];
    for (let i = 2, end = process.argv.length; i < end; ++i) {
        const file = process.argv[i];
        const $ = cherio.load(await fs_read(file));
        const html = str_strip_line_spaces($('#html').html());
        const js = str_strip_line_spaces($('#js').html());
        const js_deps = $('script[src][data-include]').map(function () { return $(this).attr('src'); }).toArray();
        const css = str_strip_line_spaces($('#css').html());
        const css_deps = $('link[href][data-include]').map(function () { return $(this).attr('href'); }).toArray();
        out.push({file, html, js, js_deps, css, css_deps});
    }
    console.log(JSON.stringify(out, null, 4));
}

function str_strip_line_spaces(s)
{
    s = String(s||'').replace(/^\n+|[\n\s]+$/g, '');

    let spaces = Number.MAX_SAFE_INTEGER;
    // Find out common number of spaces at the beginning of each line
    s.split('\n').forEach(function (line) {
        if (line.trim()) {
            spaces = Math.min(spaces, line.length - line.replace(/^ +/, '').length);
        }
    });

    // Remove the same amount of spaces from the beginning of each line
    let out = '';
    s.split('\n').forEach(function (line) {
        out += line.substr(spaces);
        out += '\n';
    });
    return out.trim() ? out : null;
}

// https://stackoverflow.com/a/57241059/1478566
function cli(main)
{
    // https://stackoverflow.com/a/46916601/1478566
    return Promise.method(main).call().catch(panic).finally(clearInterval.bind(null, setInterval(v=>v, 1E9)));
}

function panic(error)
{
    console.error(error);
    process.exit(1);
}

cli(main);
