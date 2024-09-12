package com.gepitech.soulconnection.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

enum class Permissions(val code: String) {
    EMPLOYEE("EMPLOYEE"),
    COACH("COACH"),
}

@Parcelize
data class Employee(
    val id: Int,
    val name: String?,
    val surname: String?,
    val email: String?,
    val phone: String?,
    val photo: String?,
    val address: String?,
    val permissions: Permissions?,
    val gender: Gender?,
    val role: String?,
) : Parcelable {
    override fun hashCode(): Int {
        return (id.hashCode() +
                name.hashCode() +
                surname.hashCode() +
                email.hashCode() +
                phone.hashCode() +
                photo.hashCode() +
                address.hashCode() +
                permissions.hashCode() +
                gender.hashCode() +
                role.hashCode())
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Employee

        if (id != other.id) return false
        if (name != other.name) return false
        if (surname != other.surname) return false
        if (email != other.email) return false
        if (phone != other.phone) return false
        if (photo != other.photo) return false
        if (address != other.address) return false
        if (permissions != other.permissions) return false
        if (role != other.role) return false
        if (gender != other.gender) return false

        return true
    }
}
