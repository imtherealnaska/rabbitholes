---
title: Porting dictpress to rust ( Part 2 - Understanding the flow and some investigation) .
description: Understanding the behaviour of the binary under different cases.
publicationDate: 2025-02-01
image: ../../dictpart1.JPG
---

Now that there is something to play around with [see part 1](https://www.rabbitholes.in/blog/dictpress-rust-porting-part-1).  We can go ahead and try to understand the behaviour of the binary.

Mainly, try to understand the exit conditions for each subcommand.

### 1. new-config

By the looks of it , this command just takes the sample config file that is in the `deps/` directory
named config.sample.toml which already has quite a lot of options and just creates a `config.toml` file out
of the contents of the sample file .

- Exit condition :
    - if any of the operations .ie either reading the file or finding the file fails then GG.

### 2. config

This also does more or less the same as `new-config` . This takes a file or a few files and merge them
into one single file , in order .

- Exit condition :
    - reading errors , finding files , or writing errors .


### 3. import .

Importing a [CSV](https://crates.io/crates/csv) to a DB.

### 4. site .

This has a lot of options to enable GUI, but  we will only be enabling REST APIs .

### 5. Upgrade .

Migrates the DB .

### 6. install.
First time Installation of DB. Pretty straightforward .

Two of the options, new-config and config are already implemented, I dont beleive more changes would be needed there.
