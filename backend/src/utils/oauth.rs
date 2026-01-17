use std::env;

use reqwest::Client;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct GoogleOAuthResponse {
    pub access_token: String,
    pub id_token: String,
}

#[derive(Deserialize)]
pub struct GoogleUserResult {
    pub email: String,
    pub name: String,
    pub picture: String,
}

pub async fn request_google_token(authorization_code: &str) -> Option<GoogleOAuthResponse> {
    let redirect_url = env::var("GOOGLE_REDIRECT_URL").expect("GOOGLE_REDIRECT_URL must be set");
    let client_secret = env::var("GOOGLE_CLIENT_SECRET").expect("GOOGLE_CLIENT_SECRET must be set");
    let client_id = env::var("GOOGLE_CLIENT_ID").expect("GOOGLE_CLIENT_ID must be set");

    let params = [
        ("grant_type", "authorization_code"),
        ("redirect_uri", redirect_url.as_str()),
        ("client_id", client_id.as_str()),
        ("code", authorization_code),
        ("client_secret", client_secret.as_str()),
    ];

    let response = Client::new()
        .post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send()
        .await
        .unwrap();

    if response.status().is_success() {
        Some(response.json::<GoogleOAuthResponse>().await.unwrap())
    } else {
        println!("{:#?}", response);
        let body = response.text().await.unwrap();
        println!("body: {}", body);
        return None;
    }
}

pub async fn get_google_user(access_token: &str, id_token: &str) -> Option<GoogleUserResult> {
    let url = format!(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={access_token}"
    );
    let client = Client::new();
    let response = client.get(url).bearer_auth(id_token).send().await.unwrap();

    if response.status().is_success() {
        Some(response.json::<GoogleUserResult>().await.unwrap())
    } else {
        return None;
    }
}
