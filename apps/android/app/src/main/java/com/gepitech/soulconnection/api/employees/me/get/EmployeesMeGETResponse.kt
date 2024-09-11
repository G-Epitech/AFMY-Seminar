package com.gepitech.soulconnection.api.employees.me.get

data class EmployeesMeGETResponse(
    val id: Int,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String,
    val photo: String,
    val address: String,
    val permissions: String,
    val gender: String,
    val role: String,
)
