use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.create_index(
            Index::create()
                .if_not_exists()
                .name("idx-users-teaches-skills")
                .table(UsersTeachesSkills::Table)
                .col(UsersTeachesSkills::UserId)
                .col(UsersTeachesSkills::SkillId)
                .unique()
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.drop_index(
            Index::drop()
                .name("idx-users-teaches-skills")
                .table(UsersTeachesSkills::Table)
                .to_owned(),
        )
        .await
    }
}

#[derive(Iden)]
enum UsersTeachesSkills {
    Table,
    _Id,
    UserId,
    SkillId,
}
