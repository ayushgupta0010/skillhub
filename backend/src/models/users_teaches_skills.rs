use crate::models::_entities::skills::Entity as SkillsEntity;

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

#[derive(serde::Serialize)]
pub struct TeachSkillResponse {
    pub skill_id: i32,
    pub skill_name: String,
    pub level: String,
}

// implement your read-oriented logic here
impl Model {
    pub async fn find_teach_skills(db: &DbConn, user_id: i32) -> Vec<TeachSkillResponse> {
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
            .filter_map(|(teach, skill)| {
                skill.map(|s| TeachSkillResponse {
                    skill_id: s.id,
                    skill_name: s.name,
                    level: teach.level.clone(),
                })
            })
            .collect()
    }
}

// implement your write-oriented logic here
impl ActiveModel {}

// implement your custom finders, selectors oriented logic here
impl Entity {}
