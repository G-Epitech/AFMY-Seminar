package com.gepitech.soulconnection.api

import android.content.Context
import okhttp3.Interceptor
import okhttp3.Response

class TokenInterceptor(private val context: Context) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        val sharedPref = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("authToken", null)

        return if (token != null) {
            val newRequest = request.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
            chain.proceed(newRequest)
        } else {
            chain.proceed(request)
        }
    }
}