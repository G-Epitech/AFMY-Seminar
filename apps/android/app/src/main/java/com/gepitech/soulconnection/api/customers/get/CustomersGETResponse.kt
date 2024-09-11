package com.gepitech.soulconnection.api.customers.get

data class CustomersGETResponse(
    val id: Int,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String,
    val photo: String
)
