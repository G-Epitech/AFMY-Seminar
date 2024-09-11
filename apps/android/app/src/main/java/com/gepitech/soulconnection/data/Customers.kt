package com.gepitech.soulconnection.data

enum class Gender(val code: String) {
    MA("MA"),
    FE("FE"),
    OT("OT")
}

data class Customers(
    val id: Int,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String,
    val photo: String,
)
