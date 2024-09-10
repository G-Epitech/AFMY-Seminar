package com.gepitech.soulconnection.api.auth.login

import com.gepitech.soulconnection.api.auth.login.post.LoginPOSTRequest
import com.gepitech.soulconnection.api.auth.login.post.LoginPOSTResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginService {
    @POST("/auth/login")
    fun login(
        @Body body: LoginPOSTRequest
    ): Call<LoginPOSTResponse>
}
