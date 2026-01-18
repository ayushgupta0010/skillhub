use axum::debug_handler;
use loco_rs::{controller::format, prelude::*};
use serde::{Deserialize, Serialize};

use crate::{
    models::{
        skills::ActiveModel as SkillAM,
        users::{self, Entity as UserEntity, Model as UserModel},
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
    pub user: UserModel,
    pub score: usize,
    pub teaches_skills: Vec<users_teaches_skills::Model>,
    pub learns_skills: Vec<users_learns_skills::Model>,
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
        return format::json(Vec::<TeacherMatch>::new());
    }

    let wanted_ids: Vec<i32> = wanted_skills.iter().map(|l| l.skill_id).collect();

    // 2) fetch teachers who teach any of these skills
    let teaches = users_teaches_skills::Entity::find()
        .filter(users_teaches_skills::Column::SkillId.is_in(wanted_ids))
        .all(&ctx.db)
        .await?;

    // 3) score overlaps with level awareness
    let mut scores: std::collections::HashMap<i32, usize> = Default::default();

    for teach in &teaches {
        if teach.user_id == auth.user.id {
            continue;
        }

        if let Some(learn) = wanted_skills.iter().find(|l| l.skill_id == teach.skill_id) {
            let teach_level = level_to_score(&teach.level);
            let learn_level = level_to_score(&learn.level);

            let weight = if teach_level >= learn_level {
                teach_level
            } else {
                teach_level / 2
            };

            *scores.entry(teach.user_id).or_insert(0) += weight;
        }
    }

    if scores.is_empty() {
        return format::json(Vec::<TeacherMatch>::new());
    }

    let teacher_ids: Vec<i32> = scores.keys().cloned().collect();

    // 4) fetch users in bulk
    let users_map: std::collections::HashMap<i32, UserModel> = UserEntity::find()
        .filter(users::Column::Id.is_in(teacher_ids.clone()))
        .all(&ctx.db)
        .await?
        .into_iter()
        .map(|u| (u.id, u))
        .collect();

    // 5) fetch teaches skills in bulk
    let teaches_map: std::collections::HashMap<i32, Vec<users_teaches_skills::Model>> =
        users_teaches_skills::Entity::find()
            .filter(users_teaches_skills::Column::UserId.is_in(teacher_ids.clone()))
            .all(&ctx.db)
            .await?
            .into_iter()
            .fold(Default::default(), |mut acc, t| {
                acc.entry(t.user_id).or_default().push(t);
                acc
            });

    // 6) fetch learns skills in bulk
    let learns_map: std::collections::HashMap<i32, Vec<users_learns_skills::Model>> =
        users_learns_skills::Entity::find()
            .filter(users_learns_skills::Column::UserId.is_in(teacher_ids.clone()))
            .all(&ctx.db)
            .await?
            .into_iter()
            .fold(Default::default(), |mut acc, l| {
                acc.entry(l.user_id).or_default().push(l);
                acc
            });

    // 7) assemble response
    let mut matches: Vec<TeacherMatch> = scores
        .into_iter()
        .filter_map(|(teacher_id, score)| {
            Some(TeacherMatch {
                user: users_map.get(&teacher_id)?.clone(),
                teaches_skills: teaches_map.get(&teacher_id).cloned().unwrap_or_default(),
                learns_skills: learns_map.get(&teacher_id).cloned().unwrap_or_default(),
                score,
            })
        })
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
