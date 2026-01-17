use std::env;

use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub id: i32,
    pub token_type: String,
    pub token_version: i32,
    pub iat: usize,
    pub exp: usize,
}

pub fn decode_token(token: String, secret: String) -> Option<TokenClaims> {
    let token_claim = decode::<TokenClaims>(
        token.as_str(),
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    );
    if token_claim.is_err() {
        return None;
    }
    Some(token_claim.unwrap().claims)
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Token {
    access: String,
    refresh: String,
}

pub fn get_token(id: i32, token_version: i32) -> Token {
    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let access_token_exp = (now + Duration::minutes(60)).timestamp() as usize;
    let refresh_token_exp = (now + Duration::days(7)).timestamp() as usize;

    let access_token_claims: TokenClaims = TokenClaims {
        id,
        token_version,
        token_type: "access".to_string(),
        iat,
        exp: access_token_exp,
    };

    let refresh_token_claims: TokenClaims = TokenClaims {
        id,
        token_version,
        token_type: "refresh".to_string(),
        iat,
        exp: refresh_token_exp,
    };

    let access = encode(
        &Header::default(),
        &access_token_claims,
        &EncodingKey::from_secret(
            env::var("JWT_ACCESS_SECRET")
                .expect("JWT_ACCESS_SECRET must be set")
                .as_bytes(),
        ),
    )
    .unwrap();

    let refresh = encode(
        &Header::default(),
        &refresh_token_claims,
        &EncodingKey::from_secret(
            env::var("JWT_REFRESH_SECRET")
                .expect("JWT_REFRESH_SECRET must be set")
                .as_bytes(),
        ),
    )
    .unwrap();

    Token { access, refresh }
}
