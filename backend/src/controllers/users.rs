use axum::debug_handler;
use loco_rs::{controller::format, prelude::*};
use serde::Deserialize;

use crate::{
    models::{
        skills::ActiveModel as SkillAM,
        users_learns_skills::{self, Model as UserLearnSkillsModel},
        users_teaches_skills::{self, Model as UserTeachSkillsModel},
    },
    utils::jwt::MyJWT,
};

#[derive(Deserialize)]
pub struct TeachSkillRequest {
    pub name: String,
    pub level: String,
}

#[derive(Deserialize)]
pub struct LearnSkillRequest {
    pub name: String,
    pub level: String,
}

#[debug_handler]
pub async fn me(auth: MyJWT, State(_ctx): State<AppContext>) -> Result<Response> {
    format::json(auth.user)
}

#[debug_handler]
pub async fn skills_teach(auth: MyJWT, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(UserTeachSkillsModel::find_teach_skills(&ctx.db, auth.user.id).await)
}

#[debug_handler]
pub async fn skills_learn(auth: MyJWT, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(UserLearnSkillsModel::find_learn_skills(&ctx.db, auth.user.id).await)
}

#[debug_handler]
pub async fn save_skills_teach(
    auth: MyJWT,
    State(ctx): State<AppContext>,
    Json(payload): Json<Vec<TeachSkillRequest>>,
) -> Result<Response> {
    for item in payload {
        let skill = SkillAM::get_or_create_skill(&ctx.db, item.name).await;

        let _ = users_teaches_skills::ActiveModel {
            user_id: Set(auth.user.id),
            skill_id: Set(skill.unwrap().id),
            level: Set(item.level),
            ..Default::default()
        }
        .insert(&ctx.db)
        .await;
    }

    format::json("teach skills saved successfully")
}

#[debug_handler]
pub async fn save_skills_learn(
    auth: MyJWT,
    State(ctx): State<AppContext>,
    Json(payload): Json<Vec<TeachSkillRequest>>,
) -> Result<Response> {
    for item in payload {
        let skill = SkillAM::get_or_create_skill(&ctx.db, item.name).await;

        let _ = users_learns_skills::ActiveModel {
            user_id: Set(auth.user.id),
            skill_id: Set(skill.unwrap().id),
            level: Set(item.level),
            ..Default::default()
        }
        .insert(&ctx.db)
        .await;
    }

    format::json("learn skills saved successfully")
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("users")
        .add("/me", get(me))
        .add("/skills/teach", get(skills_teach))
        .add("/skills/teach", post(save_skills_teach))
        .add("/skills/learn", get(skills_learn))
        .add("/skills/learn", post(save_skills_learn))
}
