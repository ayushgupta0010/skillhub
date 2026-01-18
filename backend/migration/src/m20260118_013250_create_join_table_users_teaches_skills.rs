use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.create_table(
            table_auto("users_teaches_skills")
                .col(pk_auto("id"))
                .col(integer("user_id"))
                .col(integer("skill_id"))
                .col(string("level"))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_users_teaches_skills_user_id")
                        .from("users_teaches_skills", "user_id")
                        .to("users", "id"),
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_users_teaches_skills_skill_id")
                        .from("users_teaches_skills", "skill_id")
                        .to("skills", "id"),
                )
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.drop_table(Table::drop().table("users_teaches_skills").to_owned())
            .await
    }
}
