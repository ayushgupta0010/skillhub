use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.create_table(
            table_auto("users_learns_skills")
                .col(pk_auto("id"))
                .col(integer("user_id"))
                .col(integer("skill_id"))
                .col(string("level"))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_users_learns_skills_user_id")
                        .from("users_learns_skills", "user_id")
                        .to("users", "id"),
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_users_learns_skills_skill_id")
                        .from("users_learns_skills", "skill_id")
                        .to("skills", "id"),
                )
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.drop_table(Table::drop().table("users_learns_skills").to_owned())
            .await
    }
}
