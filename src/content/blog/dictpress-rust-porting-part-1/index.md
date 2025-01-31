---
title: Porting dictpress to rust ( Part 1 - Getting CLI and DB setup ) .
description: A intro to dictpress. Setting up CLI structure and getting DB setup.
publicationDate: 2024-10-25
image: ./dictpart1.JPG
---


## What is dictpress ?
  In short a dictionary maker .

## How does it work?
- It provides a single binary which has all the assets required, mainly sql files and sample config files.
- It has a (peculiar?????) tokenizer system.
- A lot of DB operations.
- And a whole bunch of REST APIs .


### [clap-rs](https://crates.io/crates/clap).

This is the crate to create CLI tools in Rust , like argparse in Python. And yeah packages in Rust are called **crates** .

The CLI structure expected is :

```sh
 [I](master %) | ./dictpress --help
      --config strings   path to one or more config files (will be merged in order) (default [config.toml])
      --import string    import a CSV file into the database. eg: --import=data.csv
      --install          run first time DB installation
      --new-config       generate a new sample config.toml file.
      --site string      path to a site theme. If left empty, only HTTP APIs will be available.
      --upgrade          upgrade database to the current version
      --version          current version of the build
      --yes              assume 'yes' to prompts during --install/upgrade

dictpress (v2.0.0). Build dictionary websites. https://dict.press⏎
```

The main CLI __structure is a struct__ ...... and subcommands are generally enums . [read docs they are nice](https://docs.rs/clap/latest/clap/_derive/index.html#arg-types).
So, jumping directly into the implementation , what we need is a binary which can be used like
```sh
  ourbin COMMAND # I dont like the -- before options .
```

- `Args` struct will just have a `COMMAND` member.
- And that `COMMAND` can be one of many different types .ie enum.

```rust
#[derive(Parser)]
struct Args {
  command : Command
}

#[derive(Subcommand)]
enum Command {
    /// three slashes ... will be the explanation for each subcommand
    // Each of these options
    Version,
    ///path to one or more config files (will be merged in order) (default [config.toml]) only 5 files for now.
    Config {
        #[clap(short, long, default_value = "config.toml")]
        #[arg(value_parser=clap::value_parser!(PathBuf) , num_args=1..6)]
        files: Vec<PathBuf>,
    },
}


fn main() {
  let cli = Args::parse();
  match args.command {
    /// current version of the build.
  }
}
```

Playing around with these options here might be of help. [#[arg(value_parser=clap::value_parser!(PathBuf) , num_args=1..6)]](https://docs.rs/clap/latest/clap/_derive/index.html#arg-attributes)
This is pretty self explanatory , default_value takes the default value of the subcommand, the triple slashes are the one line explanation.

value_parser is just mentioning  the type of the argument. If you are expecting an arg of type PathBuf. Default is `string`

Just adding the subcommands required in the Go binary....

```sh
[I](try +) | ./target/debug/rustmaker
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

Ofcourse, on running these options nothing happens because there is no implementation for these, it's just a structure.
Now onto  setting up the database. Just to have some difference I will be using _Sqlite_ instead of _Postgres_ as used in the original project. But most of the APIs will remain the same.

### [sqlx-rs](https://crates.io/crates/sqlx).

Like clap for CLI tools , sqlx is like the one to use for db connections. There are other options like diesel, seaOrm and others , which I am not familiar with.<br/>
[diesel](https://diesel.rs/) : Used it for 2 mins and it started giving me linker errors.<br/>
SQLx also gives some <span class="squiggly">compile-time squiggly lines</span> indicating issues with DB connections, which is nice.

The idea here will be to get a DB Handle out of a Pool so we reuse connections and also can be passed through the app.

```rust
pub async fn get_connection_pool(dbconfig: &DBSettings) -> SqlitePool {
    SqlitePool::connect(&dbconfig.dbname).await.unwrap()
}

pub async fn run(database_settings: &DBSettings) -> Result<Pool<sqlx::Sqlite>, sqlx::Error> {
    if !Sqlite::database_exists(&database_settings.dbname)
        .await
        .unwrap_or(false)
    {
        println!("Creating database {}", database_settings.dbname);
        match Sqlite::create_database(&database_settings.dbname).await {
            Ok(_) => println!("Create db success"),
            Err(error) => panic!("error : {}", error),
        }
    } else {
        println!("Database already exists");
    }

    let db = get_connection_pool(database_settings).await;
    Ok(db)
}

```

Also we need to get the SQL files which have the required queries in them but they are in Postgres. After some help from Claude , quicky getting a SQLite query file we need to execute it on the
db handle. After adding the files and making sure we get a DB, one of the subcommands that  needs to be implemented __install__ is implemented!!!

To get the SQL files as assets we can make use of the [rust_embed](https://crates.io/crates/rust-embed) crate. Not to go too deep into this , using this crate is pretty straight forward.
With respect to our use case of loading some files and unloading them, we need to know the dir prefix , as like how  to address them and where they are found in the current dir structure(relative to the main cargo.toml file).
```rust
#[derive(Embed)]
#[folder = "deps/"]
#[prefix = "deps/"]
pub struct Asset;

// getting files out is pretty easy
let sample_config = Asset::get("deps/config.sample.toml").unwrap();
let new_config = sample_config.data.as_ref();

let new_config =
     std::str::from_utf8(new_config).expect("issue with converting types from u8 to str");

let replaced_file_contents = new_config.replace("dictpress_admin_password", &fake_password);

fs::write("config.toml", replaced_file_contents)?;
```

While checking for other crates to achieve the same , I stumbled upon another cute looking crate [include_dir!](https://crates.io/crates/include_dir) which was a huge problem for me. I thought it would work like
include_str!() in stdlib but using this as intended in the docs just gave me some craxyyyyy compile times ..... some of the times it would just hang , maybe it's gotten better now !!!.

Just like that both **install** and **new-config** subcommands are done ✅

## Rabbithole:

[Maybe this](https://github.com/launchbadge/sqlx/issues/3166)
