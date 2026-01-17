use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "users",
            &[
            
            ("id", ColType::PkAuto),
            
            ("first_name", ColType::String),
            ("last_name", ColType::String),
            ("email", ColType::StringUniq),
            ("discord_id", ColType::StringNull),
            ("provider", ColType::String),
            ("token_version", ColType::Integer),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "users").await
    }
}
