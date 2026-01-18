use axum::debug_handler;
use loco_rs::{controller::format, prelude::*};

use crate::{models::chats::Model as ChatModel, utils::jwt::MyJWT};

#[debug_handler]
pub async fn get_chats_in_group(
    _auth: MyJWT,
    Path(group): Path<String>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    format::json(ChatModel::find_by_group(&ctx.db, group).await)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("chats")
        .add("/group/{group}", get(get_chats_in_group))
}
