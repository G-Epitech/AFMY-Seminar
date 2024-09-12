package com.gepitech.soulconnection.api.auth.login.post

data class Tokens(
    val access: String,
)

data class LoginPOSTResponse(
    val tokens: Tokens
)
