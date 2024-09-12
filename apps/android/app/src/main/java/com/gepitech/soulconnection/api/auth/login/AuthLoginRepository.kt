package com.gepitech.soulconnection.api.auth.login

import android.content.Context
import com.gepitech.soulconnection.api.RetrofitInstance
import com.gepitech.soulconnection.api.auth.login.post.LoginPOSTRequest

class AuthLoginRepository(context: Context) {
    private val api: AuthLoginService =
        RetrofitInstance.getInstance(context).create(AuthLoginService::class.java);

    fun login(body: LoginPOSTRequest) = api.login(body)
}
