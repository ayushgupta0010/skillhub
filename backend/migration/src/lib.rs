#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20260117_165438_skills;
mod m20260117_165721_users;
mod m20260117_170000_teaches;
mod m20260117_170609_learns;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260117_165438_skills::Migration),
            Box::new(m20260117_165721_users::Migration),
            Box::new(m20260117_170000_teaches::Migration),
            Box::new(m20260117_170609_learns::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}