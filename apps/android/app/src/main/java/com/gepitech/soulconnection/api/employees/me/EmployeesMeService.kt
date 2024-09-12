package com.gepitech.soulconnection.api.employees.me

import com.gepitech.soulconnection.api.employees.me.get.EmployeesMeGETResponse
import retrofit2.Call
import retrofit2.http.GET

interface EmployeesMeService {
    @GET("/employees/me")
    fun getMe(): Call<EmployeesMeGETResponse>
}
