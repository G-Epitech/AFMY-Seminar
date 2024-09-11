package com.gepitech.soulconnection.api.employees.me

import android.content.Context
import com.gepitech.soulconnection.api.RetrofitInstance

class EmployeesMeRepository(context: Context) {
    private val api: EmployeesMeService =
        RetrofitInstance.getInstance(context).create(EmployeesMeService::class.java);

    fun getMe() = api.getMe()
}
