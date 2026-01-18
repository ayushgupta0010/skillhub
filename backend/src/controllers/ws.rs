use std::{collections::HashMap, env, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        Query, WebSocketUpgrade,
    },
    http::StatusCode,
    response::Response,
};
use futures_util::{SinkExt, StreamExt};
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use tokio::sync::{
    mpsc::{self, UnboundedSender},
    Mutex,
};

use crate::{
    models::{chats, users::Model as UserModel},
    utils::token::decode_token,
};
use sea_orm::ActiveModelTrait;
use sea_orm::Set;

#[derive(Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum ChatMessage {
    Client(ClientChat),
    Server(ServerChat),
}

type ClientMap = Arc<Mutex<HashMap<String, UnboundedSender<ChatMessage>>>>;

#[derive(Deserialize)]
struct JwtQuery {
    token: String,
}

async fn handler(
    ws: WebSocketUpgrade,
    Query(params): Query<JwtQuery>,
    State(app): State<AppState>,
) -> Response {
    let claims = decode_token(
        params.token,
        env::var("JWT_ACCESS_SECRET").expect("JWT_ACCESS_SECRET must be set"),
    );
    if claims.is_none() {
        return (StatusCode::UNAUTHORIZED, "Invalid token").into_response();
    }

    let user = UserModel::find_by_id(&app.db, claims.unwrap().id).await;
    if user.is_none() {
        return (StatusCode::UNAUTHORIZED, "Invalid user").into_response();
    }

    ws.on_upgrade(|socket| handle_socket(socket, app, user.unwrap().email))
}

async fn handle_socket(ws: WebSocket, app: AppState, client_id: String) {
    let (mut ws_tx, mut ws_rx) = ws.split();

    // channel to send messages into this client
    let (tx, mut rx) = mpsc::unbounded_channel::<ChatMessage>();
    app.clients.lock().await.insert(client_id.clone(), tx);

    // task to send outgoing messages to this socket
    tokio::spawn(async move {
        while let Some(message) = rx.recv().await {
            let text = serde_json::to_string(&message).unwrap();
            let _ = ws_tx.send(Message::Text(text.into())).await;
        }
    });

    // receive from client
    while let Some(Ok(Message::Text(txt))) = ws_rx.next().await {
        // parse the client message
        if let Ok(chat) = serde_json::from_str::<ClientChat>(&txt) {
            let active = chats::ActiveModel {
                group: Set(chat.group.clone()),
                sender: Set(chat.sender),
                msg: Set(chat.msg.clone()),
                ..Default::default()
            };
            let saved = active.insert(&app.db).await.unwrap();

            // build server message
            let server_msg = ChatMessage::Server(ServerChat {
                id: saved.id,
                group: chat.group.clone(),
                sender: saved.sender,
                msg: saved.msg.clone(),
                created_at: saved.created_at.clone(),
            });

            // broadcast to all clients in same group
            let clients = app.clients.lock().await.clone();
            for (id, client_tx) in clients.into_iter() {
                if id.starts_with(&chat.group) {
                    let _ = client_tx.send(server_msg.clone());
                }
            }
        }
    }

    // remove client on disconnect
    app.clients.lock().await.remove(&client_id);
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ClientChat {
    pub sender: i32,
    pub group: String,
    pub msg: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ServerChat {
    pub id: i32,
    pub msg: String,
    pub group: String,
    pub sender: i32,
    pub created_at: DateTimeWithTimeZone,
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub clients: ClientMap,
    pub db: DatabaseConnection,
}

pub fn routes(ctx: &AppContext) -> Routes {
    let clients: ClientMap = Arc::new(Mutex::new(HashMap::new()));

    let app = AppState {
        clients: clients.clone(),
        db: ctx.db.clone(),
    };

    Routes::new().add("/ws", get(handler).with_state(app))
}
