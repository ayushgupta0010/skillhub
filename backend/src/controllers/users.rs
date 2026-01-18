use axum::debug_handler;
use loco_rs::{controller::format, prelude::*};

use crate::utils::jwt::MyJWT;

#[debug_handler]
pub async fn me(auth: MyJWT, State(_ctx): State<AppContext>) -> Result<Response> {
    format::json(auth.user)
}

pub fn routes() -> Routes {
    Routes::new().prefix("users").add("/me", get(me))
}
