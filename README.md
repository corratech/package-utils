Utils to work with `package.json` files.

Install globally or locally

    npm install -g @corratech/package-utils

# package-merge

With `package-merge` you merge multiple files into one `package.json` file.

    package-merge package.a.json package.b.json package.c.json > package.json

On the command line it exits when there is no strategy to merge the values.
In the API you can provide custom handling via callback.

# package-deps

    package-deps -d a/package.json b/package.json
    mkdirp@0.5.1
    moment@2.11.2

With `package-deps` you get the dependencies of all the project files passed in. 
With the `-d` option this includes only the `devDependencies` section. 
With the `-r` option this includes only the `dependencies` section. 
With the `-a` option this includes both the sections. 
On the command line clashing versions will be reported and the last version wins. You should manually update the packages with correct version.

# package-resolve

Resolves dependencies set to `RESOLVE` to what's in the dict.

    cat package.json | package-resolve dict.json > out.json
