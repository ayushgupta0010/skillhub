use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "teaches",
            &[
            
            ("id", ColType::PkAuto),
            
            ("user_id", ColType::Integer),
            ("skill_id", ColType::Integer),
            ("level", ColType::Integer),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "teaches").await
    }
}
