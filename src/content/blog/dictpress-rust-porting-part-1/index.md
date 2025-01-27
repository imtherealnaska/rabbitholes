---
title: Porting dictpress to rust ( Part 1 - Getting CLI and DB setup ) .
description: A intro to dictpress. Setting up CLI structure and getting DB setup.
publicationDate: 2024-10-25
---


## What is dictpress ?
  In short a dictionary maker .

[clap-rs](https://crates.io/crates/clap).

- This crate is the standard to create CLI tools , like argparse in Python. And yeah packages in Rust are called __crates__ .

The CLI structure expected is like this :
```sh
I  (try +) | ./target/debug/rustmaker                                                                                                                                                                                                                            6 changed try ↑
Usage: rustmaker <COMMAND>

Commands:
 import      Import a CSV file into the database. eg --import /path/to/file.csv
 upgrade     upgrade database to the current version
 version     current version of the build
 config      path to one or more config files (will be merged in order) (default [config.toml]) only 5 files for now
 install     Run first time DB installation
 yes         Assume 'yes' to prompts during --install/upgrade
 site        Path to a site theme. If left empty, only HTTP APIs will be available
 new-config  Generate a new sample config.toml file
 help        Print this message or the help of the given subcommand(s)

Options:
 -h, --help     Print help
 -V, --version  Print version
```
