package com.gepitech.soulconnection.data

enum class Permissions(val code: String) {
    EMPLOYEE("EMPLOYEE"),
    COACH("COACH"),
}

data class Employees(
    val id: Int,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String,
    val photo: String,
    val address: String,
    val permissions: Permissions,
    val rol: String,
)
