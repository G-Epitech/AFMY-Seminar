package com.gepitech.soulconnection.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

enum class Gender(val code: String) {
    MA("MA"),
    FE("FE"),
    OT("OT")
}

@Parcelize
data class Customer(
    val id: Int,
    val name: String?,
    val surname: String?,
    val email: String?,
    val phone: String?,
    val photo: String?,
    val birthdate: String?,
    val description: String?,
    val gender: Gender?,
    val address: String?,
    val country: String?
) : Parcelable {
    override fun hashCode(): Int {
        return (id.hashCode() +
                (name?.hashCode() ?: 0) +
                (surname?.hashCode() ?: 0) +
                (email?.hashCode() ?: 0) +
                (phone?.hashCode() ?: 0) +
                (photo?.hashCode() ?: 0) +
                (birthdate?.hashCode() ?: 0) +
                (description?.hashCode() ?: 0) +
                (gender?.hashCode() ?: 0) +
                (address?.hashCode() ?: 0) +
                (country?.hashCode() ?: 0))
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Customer

        if (id != other.id) return false
        if (name != other.name) return false
        if (surname != other.surname) return false
        if (email != other.email) return false
        if (phone != other.phone) return false
        if (photo != other.photo) return false
        if (birthdate != other.birthdate) return false
        if (description != other.description) return false
        if (gender != other.gender) return false
        if (address != other.address) return false
        if (country != other.country) return false

        return true
    }
}

