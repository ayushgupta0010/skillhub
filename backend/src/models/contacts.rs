use crate::models::{
    _entities::contacts,
    users::{Entity as UserEntity, Model as UserModel},
};

pub use super::_entities::contacts::{ActiveModel, Column, Entity, Model};
use sea_orm::{entity::prelude::*, QuerySelect};
pub type Contacts = Entity;

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
    pub async fn find_contacts(db: &DbConn, user_id: i32) -> Vec<(Self, Option<UserModel>)> {
        contacts::Entity::find()
            .join(
                sea_orm::JoinType::LeftJoin,
                contacts::Relation::Users2.def(), // join on `other`
            )
            .select_also(UserEntity)
            .filter(contacts::Column::You.eq(user_id))
            .all(db)
            .await
            .unwrap()
    }
}

// implement your write-oriented logic here
impl ActiveModel {}

// implement your custom finders, selectors oriented logic here
impl Entity {}
