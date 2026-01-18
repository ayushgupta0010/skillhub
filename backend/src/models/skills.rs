pub use super::_entities::skills::{ActiveModel, Column, Entity, Model};
use sea_orm::{entity::prelude::*, ActiveValue::Set};
pub type Skills = Entity;

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn before_save<C>(self, _db: &C, insert: bool) -> std::result::Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if !insert && self.updated_at.is_unchanged() {
            let mut this = self;
            this.updated_at = sea_orm::ActiveValue::Set(chrono::Utc::now().into());
            Ok(this)
        } else {
            Ok(self)
        }
    }
}

// implement your read-oriented logic here
impl Model {
    pub async fn find_by_name(db: &DbConn, name: String) -> Option<Self> {
        Entity::find()
            .filter(Column::Name.eq(name))
            .one(db)
            .await
            .unwrap()
    }
}

// implement your write-oriented logic here
impl ActiveModel {
    pub async fn get_or_create_skill(db: &DbConn, skill_name: String) -> Option<Model> {
        match Entity::find()
            .filter(Column::Name.eq(skill_name.clone()))
            .one(db)
            .await
        {
            Ok(Some(existing)) => return Some(existing),
            Ok(None) => {}
            Err(_) => return None, // Handle query error
        }

        // Insert a new skill if not found
        let active = ActiveModel {
            name: Set(skill_name),
            ..Default::default()
        };

        // Insert returns Result<Model, DbErr>, so handle accordingly
        match active.insert(db).await {
            Ok(model) => Some(model),
            Err(_) => None,
        }
    }
}

// implement your custom finders, selectors oriented logic here
impl Entity {}
