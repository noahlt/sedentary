Sedentary
---------

Sedentary automatically translates natural language commands into sed commands.

It operates by doing a Google search on the arguments passed to it plus the
keyword "sed", taking the first result and attempting to extract a sed command
from `<code>` blocks present on the page.

### Usage

To install dependencies, run `npm install` inside this source directory.

Run the script from this source directory with `node sedentary.js sed remove
blank lines`.

### Caveats

It usually doesn't work.  The two most common failure modes are:

 1. multiple code examples on the page, only one of which does what you want
 2. examples that only work with GNU sed -- OS X comes with BSD sed.

### The idea

There's a class of text-manipulation problems which sed is particularly
well-suited to solving.  After writing shell scripts for a few years, I have
learned to discern whether a problem can be solved with sed.

However, I have never actually learned the details of sed.  Instead, every
time I use it, I google for what I want to do, and invariably I find a blog
post or mailing list post that describes how to do what I want to do.

So I decided to write a script to automate this process.

### Future work

 - Some way to disambiguate between GNU sed and BSD sed.
 - Look at text blocks surrounding code blocks, see whether they match the
   search keywords, and use that to pick the code example to use.
 - figure out the right way with npm to make this a global command that you
   can run from anywhere.
 - actually run the sed command, so you can pipe into and out of sedentary

I would pursue these if I thought it was worth it, but it seems to work so
rarely that I think it'll always be better to have a human scanning search
results to pick out the right code to use.

Still think it's a neat idea, though.
