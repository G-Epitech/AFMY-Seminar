package com.gepitech.soulconnection.api.customers

import com.gepitech.soulconnection.data.Customer
import com.gepitech.soulconnection.data.PageResponse
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface CustomersService {
    @GET("/customers")
    fun getCustomers(@Query("page") page: Int, @Query("size") size: Int): Call<PageResponse<Customer>>
}
