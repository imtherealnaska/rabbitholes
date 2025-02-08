---
title: Porting dictpress to rust ( Part 3 - Implementing DB operations) .
description: Implementing the `upgrade` option .
publicationDate: 2025-02-05
image: ../../dictpart1.JPG
---

### What does the option do?
- As the name suggests it upgrades the db , if any migrations are left.
- what are database migrations ?
    - It is like git commits for your DB .
    - Just like git commits , migrations track changes to the database schema .
    - So things like `git reset` (migrations through rollbacks) are possible.

### Get the migrations that are pending:
- Get the migrations that are pending and apply those migrations .

```SQL
 I  (main *) | sqlite3 dbname
SQLite version 3.43.2 2023-10-10 13:08:14
Enter ".help" for usage hints.
sqlite> SELECT COALESCE((SELECT value FROM settings WHERE key='migrations'), '0.0.0');
["v2.0.0"]
```

- Had to remove the '[' , 'v' , '"', ']' characters so that we have a `digit.digit.digit` instead of `["vdigit.digit.digit"]`. Because `Version` type from [Semver](https://docs.rs/semver/1.0.25/semver/struct.Version.html)
crate does not support parsing when [those characters exist](https://github.com/dtolnay/semver/blob/4fa7acb3181fdc52d8eb9712598b192b30c341fa/src/parse.rs#L17) in the version type variable while comparing.

```rust
async fn get_pending_migrations(db: &SqlitePool) -> Result<(String, Vec<&'static Migration>)> {
    let last_ver = get_last_migration_version(db).await?;
    let clean_ver = last_ver.trim_matches(|c| c == '[' || c == ']' || c == '"' || c == 'v');
    println!("last version is {}", clean_ver);
    let to_run = MIGRATIONS
        .iter()
        .skip_while(|m| {
            println!("m.version is {}", m.version);
            let m_version = Version::parse(m.version).unwrap();
            let last_version = Version::parse(clean_ver).unwrap();
            m_version <= last_version
        })
        .collect();

    Ok((last_ver, to_run))
}

async fn get_last_migration_version(db: &SqlitePool) -> Result<String> {
    let result = sqlx::query(
        "SELECT COALESCE((SELECT value FROM settings WHERE key='migrations'), '0.0.0')",
    )
    .fetch_one(db)
    .await;

    match result {
        Ok(row) => Ok(row.get(0)),
        Err(e) => match e {
            sqlx::Error::Database(dbe) if dbe.message().contains("no such table") => {
                Ok("0.0.0".to_string())
            }
            other => Err(other.into()),
        },
    }
}
```

### `Migration` struct:
```rust
type MigrationFn =
    for<'a> fn(&'a SqlitePool) -> Pin<Box<dyn Future<Output = Result<()>> + Send + 'a>>;

#[derive(Debug)]
struct Migration {
    version: &'static str,
    func: MigrationFn,
}

const MIGRATIONS: &[Migration] = &[Migration {
    version: "2.0.0",
    func: |db| Box::pin(v2_0_0(db)),
}];

```
A constant named MIGRATIONS is defined. Each `Migration` struct represents a database migration, which is a way to modify the database schema over time in a controlled and versioned manner.

Initially , MIGRATIONS array contains a single Migration struct. This struct has two fields: version and func. The version field is a string that indicates the version of the migration, in this case, "2.0.0". This helps in tracking which migrations have been applied to the
database.

The func field is a closure that takes a database connection (db) as an argument and returns a [pinned future](https://www.rabbitholes.in/blog/pinning-in-rust/). This closure uses the Box::pin function to pin the future returned by the v2_0_0 async function. Pinning is necessary here because the future returned by v2_0_0 needs to be stored on the heap and must not be moved in memory, which is a requirement for certain async operations in Rust.
The v2_0_0 function itself is responsible for executing the SQL commands that perform the actual migration. It creates a new table called settings if it does not already exist, adds an index on the key column of the settings table, and alters the entries table to add a new column called meta.

### Some errors encountered:
- Basically I had version in `MIGRATIONS` as String::from("2.0.0"), but constants are evaluated at compile time and `String::from` is a runtime operation. After fixing that , the issue resolved.

```bash
cannot call non-const fn `<std::string::String as std::convert::From<&str>>::from` in constants
calls in constants are limited to constant functions, tuple structs and tuple variant
```

- Also had issues with Result type , since I had used `std::result::Result` and `anyhow::Result` in a haphazard way. Then only used Result from anyhow and things worked. Don't do that.
