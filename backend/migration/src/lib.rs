#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20260117_165438_skills;
mod m20260117_231643_users;
mod m20260118_013250_create_join_table_users_teaches_skills;
mod m20260118_015253_create_join_table_user_learns_skill;
mod m20260118_033734_add_profile_pic_to_users;
mod m20260118_054722_contacts;
mod m20260118_081602_create_index_on_users_learns_skills;
mod m20260118_082401_create_index_on_users_teaches_skills;
mod m20260118_172604_chats;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260117_165438_skills::Migration),
            Box::new(m20260117_231643_users::Migration),
            Box::new(m20260118_013250_create_join_table_users_teaches_skills::Migration),
            Box::new(m20260118_015253_create_join_table_user_learns_skill::Migration),
            Box::new(m20260118_033734_add_profile_pic_to_users::Migration),
            Box::new(m20260118_054722_contacts::Migration),
            Box::new(m20260118_081602_create_index_on_users_learns_skills::Migration),
            Box::new(m20260118_082401_create_index_on_users_teaches_skills::Migration),
            Box::new(m20260118_172604_chats::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}