use crate::models::_entities::skills::{Entity as SkillsEntity, Model as SkillsModel};

pub use super::_entities::users_teaches_skills::{ActiveModel, Column, Entity, Model};
use sea_orm::entity::prelude::*;
pub type UsersTeachesSkills = Entity;

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn before_save<C>(self, _db: &C, _insert: bool) -> std::result::Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(self)
    }
}

// implement your read-oriented logic here
impl Model {
    pub async fn find_teach_skills(db: &DbConn, user_id: i32) -> Vec<SkillsModel> {
        let skills = Entity::find()
            .filter(Column::UserId.eq(user_id))
            .find_also_related(SkillsEntity)
            .all(db)
            .await;
        if skills.is_err() {
            return vec![];
        }
        skills
            .unwrap()
            .into_iter()
            .filter_map(|(_teach, skill)| skill) // Keep only the joined skill models
            .collect()
    }
}

// implement your write-oriented logic here
impl ActiveModel {}

// implement your custom finders, selectors oriented logic here
impl Entity {}
