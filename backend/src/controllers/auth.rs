use axum::debug_handler;
use loco_rs::prelude::*;
use serde::Deserialize;
use std::env;

use crate::{
    models::_entities::users::{self, ActiveModel as UserAM, Model as UserModel},
    utils::{
        jwt::MyJWT,
        oauth::{get_google_user, request_google_token},
        token::{decode_token, get_token},
    },
};

// Payloads
#[derive(Deserialize)]
pub struct LoginPayload {
    pub code: String,
}

#[derive(Deserialize)]
pub struct RefreshPayload {
    pub refresh_token: String,
}

// Handlers
#[debug_handler]
pub async fn login(
    State(ctx): State<AppContext>,
    Json(payload): Json<LoginPayload>,
) -> Result<Response> {
    let token_response = request_google_token(payload.code.as_str()).await;
    if token_response.is_none() {
        return Err(Error::BadRequest("OAuth Token Error".to_string()));
    }

    let token_response = token_response.unwrap();
    let google_user = get_google_user(&token_response.access_token, &token_response.id_token).await;
    if google_user.is_none() {
        return Err(Error::BadRequest("OAuth User Not Found Error".to_string()));
    }

    let google_user = google_user.unwrap();
    let email = google_user.email.to_lowercase();

    if let Some(user) = UserModel::find_by_email(&ctx.db, &email).await {
        let token = get_token(user.id, user.token_version);
        return format::json(token);
    } else {
        let parts: Vec<_> = google_user.name.split(' ').collect();
        let (first_name, last_name) = (parts[0], parts[1]);

        let user = UserAM {
            first_name: Set(first_name.to_string()),
            last_name: Set(last_name.to_string()),
            email: Set(email),
            provider: Set("google".to_string()),
            token_version: Set(1),
            ..Default::default()
        }
        .save(&ctx.db)
        .await;

        if user.is_err() {
            println!("{:#?}", user);
            return Err(Error::BadRequest("Email already in use.".to_string()));
        }

        let user = user.unwrap();
        let token = get_token(user.id.unwrap(), user.token_version.unwrap());
        return format::json(token);
    }
}

#[debug_handler]
pub async fn logout(State(ctx): State<AppContext>, auth: MyJWT) -> Result<Response> {
    let new_token_version = auth.user.token_version + 1;
    let mut am: users::ActiveModel = auth.user.into();
    am.token_version = Set(new_token_version); // invalidate old tokens
    am.save(&ctx.db).await?;
    format::empty_json()
}

#[debug_handler]
pub async fn refresh_token(
    State(ctx): State<AppContext>,
    Json(payload): Json<RefreshPayload>,
) -> Result<Response> {
    let claims = decode_token(
        payload.refresh_token,
        env::var("JWT_REFRESH_SECRET").expect("JWT_REFRESH_SECRET must be set"),
    )
    .ok_or_else(|| Error::BadRequest("Invalid refresh token".to_string()))?;

    if claims.token_type != "refresh" {
        return Err(Error::BadRequest("Wrong token type".to_string()));
    }

    if let Some(user) = UserModel::find_by_id(&ctx.db, claims.id).await {
        if user.token_version != claims.token_version {
            return Err(Error::BadRequest("Token version mismatch".to_string()));
        }
        let token = get_token(user.id, user.token_version);
        return format::json(token);
    }

    Err(Error::BadRequest("User not found".to_string()))
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("auth")
        .add("/login", post(login))
        .add("/logout", post(logout))
        .add("/refresh", post(refresh_token))
}
