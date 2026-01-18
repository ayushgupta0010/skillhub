use axum::debug_handler;
use loco_rs::{controller::format, prelude::*};
use serde::Deserialize;

use crate::{
    models::contacts::{ActiveModel as ContactAM, Model as ContactModel},
    utils::jwt::MyJWT,
};

#[derive(Deserialize)]
pub struct CreateContact {
    pub other: i32,
}

#[debug_handler]
pub async fn my_contacts(auth: MyJWT, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(ContactModel::find_contacts(&ctx.db, auth.user.id).await)
}

#[debug_handler]
pub async fn create_contacts(
    auth: MyJWT,
    State(ctx): State<AppContext>,
    Json(payload): Json<CreateContact>,
) -> Result<Response> {
    let first = ContactAM {
        you: Set(auth.user.id),
        other: Set(payload.other),
        ..Default::default()
    }
    .insert(&ctx.db)
    .await;

    if first.is_err() {
        return Err(Error::BadRequest("Unknown error occured".to_string()));
    }

    let second = ContactAM {
        you: Set(payload.other),
        other: Set(auth.user.id),
        ..Default::default()
    }
    .insert(&ctx.db)
    .await;

    if second.is_err() {
        let _ = first.unwrap().delete(&ctx.db).await;
        return Err(Error::BadRequest("Unknown error occured".to_string()));
    }

    format::json("Contact created")
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("contact")
        .add("/", get(my_contacts))
        .add("/", post(create_contacts))
}
