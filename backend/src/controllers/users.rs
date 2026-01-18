use axum::debug_handler;
use loco_rs::{controller::format, prelude::*};
use serde::{Deserialize, Serialize};

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

#[derive(Serialize)]
pub struct TeacherMatch {
    pub teacher_id: i32,
    pub score: usize,
}

fn level_to_score(level: &str) -> usize {
    match level {
        "beginner" => 1,
        "intermediate" => 2,
        "advanced" => 3,
        "expert" => 4,
        _ => 0,
    }
}

#[debug_handler]
pub async fn recommend(auth: MyJWT, State(ctx): State<AppContext>) -> Result<Response> {
    // 1) fetch all skills the learner wants
    let wanted_skills = users_learns_skills::Entity::find()
        .filter(users_learns_skills::Column::UserId.eq(auth.user.id))
        .all(&ctx.db)
        .await?;
    if wanted_skills.is_empty() {
        return format::json(Vec::<i32>::new());
    }

    // map skill_id -> wanted
    let wanted_ids: Vec<i32> = wanted_skills
        .clone()
        .into_iter()
        .map(|l| l.skill_id)
        .collect();

    // 2) fetch teachers who teach any of these skills
    let teaches = users_teaches_skills::Entity::find()
        .filter(users_teaches_skills::Column::SkillId.is_in(wanted_ids.clone()))
        .all(&ctx.db)
        .await?;

    // 3) score overlaps: count how many matching skills each teacher has
    let mut scores: std::collections::HashMap<i32, usize> = Default::default();
    for teach in &teaches {
        if teach.user_id == auth.user.id {
            continue;
        }

        for learn in &wanted_skills {
            if teach.skill_id == learn.skill_id {
                let teach_level = level_to_score(&teach.level);
                let learn_level = level_to_score(&learn.level);

                let weight = if teach_level >= learn_level {
                    // teacher has equal or higher level → full weight
                    teach_level
                } else {
                    // under qualified → discounted
                    teach_level / 2
                };

                *scores.entry(teach.user_id).or_insert(0) += weight;
            }
        }
    }

    // 4) sort by score descending
    let mut matches: Vec<_> = scores
        .into_iter()
        .map(|(teacher_id, score)| TeacherMatch { teacher_id, score })
        .collect();

    matches.sort_by(|a, b| b.score.cmp(&a.score));

    format::json(matches)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("users")
        .add("/me", get(me))
        .add("/skills/teach", get(skills_teach))
        .add("/skills/teach", post(save_skills_teach))
        .add("/skills/learn", get(skills_learn))
        .add("/skills/learn", post(save_skills_learn))
        .add("/skills/recommend", get(recommend))
}
