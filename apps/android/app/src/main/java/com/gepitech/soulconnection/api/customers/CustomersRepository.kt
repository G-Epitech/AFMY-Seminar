package com.gepitech.soulconnection.api.customers

import android.content.Context
import com.gepitech.soulconnection.api.RetrofitInstance

class CustomersRepository(context: Context) {
    private val api: CustomersService =
        RetrofitInstance.getInstance(context).create(CustomersService::class.java);

    fun getCustomers(page: Int, size: Int) = api.getCustomers(page, size)
}
