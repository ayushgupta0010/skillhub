use std::env;

use axum::{
    extract::{FromRef, FromRequestParts},
    http::{request::Parts, HeaderMap},
};
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::{
    models::users::Model as UserModel,
    utils::token::{decode_token, TokenClaims},
};

#[derive(Debug, Deserialize, Serialize)]
pub struct MyJWT {
    pub claims: TokenClaims,
    pub user: UserModel,
}

impl<S> FromRequestParts<S> for MyJWT
where
    AppContext: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Error> {
        let ctx: AppContext = AppContext::from_ref(state);
        let token = extract_token_from_header(&parts.headers)?;

        let claims = decode_token(
            token,
            env::var("JWT_ACCESS_SECRET").expect("JWT_ACCESS_SECRET must be set"),
        )
        .ok_or_else(|| Error::BadRequest("Invalid token".to_string()))?;
        if claims.token_type != "access" {
            return Err(Error::BadRequest("Bad token type".to_string()));
        }

        let user = UserModel::find_by_id(&ctx.db, claims.id).await;
        if user.is_none() {
            return Err(Error::BadRequest("Invalid token".to_string()));
        }

        Ok(MyJWT {
            claims,
            user: user.unwrap(),
        })
    }
}
pub fn extract_token_from_header(headers: &HeaderMap) -> Result<String> {
    Ok(headers
        .get("authorization")
        .ok_or_else(|| Error::Unauthorized(format!("header authorization token not found")))?
        .to_str()
        .map_err(|err| Error::Unauthorized(err.to_string()))?
        .strip_prefix("JWT ")
        .ok_or_else(|| Error::Unauthorized(format!("error strip authorization value")))?
        .to_string())
}
