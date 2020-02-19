#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander')
const fs = require('fs')

let flushedClashSectionHeading = false;

function merge(file, name, a, b) {
  if (a && a != b) {
    if(!flushedClashSectionHeading){
      console.error(chalk.red("======================================================================================="));
      console.error(chalk.red("                                Version Conflict Detected                              "));
      console.error(chalk.red("======================================================================================="));
      flushedClashSectionHeading = true;
    }
    console.error(chalk.red("clash in " ) + chalk.yellow(file) + chalk.red(" [" + name + "] wants version " + b + " and version " + a + " is used elsewhere"))
  }
  return b
}

program
  .version('2.0.0')
  .arguments('[files...]')
  .option('-r, --runtime', 'scan only runtime devDependencies')
  .option('-d, --dev', 'scan only dev devDependencies')
  .option('-a, --all', 'scan runtime as well as dev devDependencies')
  .action(function(files) {
    console.log("");
    if (program.runtime) {      
      console.log(chalk.black.bgYellow.bold("Searching Runtime Dependencies"));
    }else if (program.dev){
      console.log(chalk.black.bgYellow.bold("Searching Dev Dependencies"));
    }else{
      console.log(chalk.black.bgYellow.bold("Searching Runtime and Dev Dependencies"));
    }
    console.log("");
    
    const deps = new Map()
    files.forEach(function(file) {
      const json = JSON.parse(fs.readFileSync(file, 'utf8'))

      const maps = []

      if (program.runtime) {
        maps.push(json.dependencies || {});
      }else if (program.dev){
        maps.push(json.devDependencies || {});
      }else{
        maps.push(json.dependencies || {});
        maps.push(json.devDependencies || {});
      }

      maps.forEach(function(map) {
        Object.keys(map).forEach(function(name) {
          const version = map[name]
          deps.set(name, merge(file, name, deps.get(name), version))
        })
      })
    })
    console.log("");
    console.log("Following Dependencies identified across all components");
    console.error("=======================================================================================");
    deps.forEach(function(version, name) {
      console.log(name + "@" + version)
    })
  })
  .parse(process.argv);