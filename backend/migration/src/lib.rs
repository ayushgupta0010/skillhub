#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20260117_165438_skills;
mod m20260117_231643_users;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260117_165438_skills::Migration),
            Box::new(m20260117_231643_users::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
