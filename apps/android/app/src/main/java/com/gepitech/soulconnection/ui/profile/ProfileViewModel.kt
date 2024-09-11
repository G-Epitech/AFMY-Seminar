package com.gepitech.soulconnection.ui.profile

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.gepitech.soulconnection.data.Employee
import com.gepitech.soulconnection.data.Gender
import com.gepitech.soulconnection.data.Permissions
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class ProfileViewModel(application: Application) : AndroidViewModel(application) {

    private val _text = MutableLiveData<String>().apply {
        value = "This is gallery Fragment"
    }
    val text: LiveData<String> = _text
    private val _employee = MutableLiveData<Employee>()
    val employee: LiveData<Employee> get() = _employee

    private val context: Context = getApplication<Application>()

    fun fetchEmployee() {
        Log.i("ProfileViewModel", "fetchEmployee")
        val sharedPreferences = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val employee = getEmployee(sharedPreferences)
        Log.i("ProfileViewModel", "employee: $employee")
        if (employee != null) {
            _employee.value = employee!!
        }
    }

    fun getEmployee(sharedPreferences: SharedPreferences): Employee? {
        val jsonString = sharedPreferences.getString("employee", null) ?: return null
        val bundleType = object : TypeToken<Bundle>() {}.type
        val bundle = Gson().fromJson(jsonString, bundleType) as Bundle
        return bundle.getParcelable("employee")
    }

    private fun getPermissions(permissions: String): Permissions {
        return when (permissions) {
            "EMPLOYEE" -> Permissions.EMPLOYEE
            "COACH" -> Permissions.COACH
            else -> Permissions.EMPLOYEE
        }
    }

    private fun getGender(gender: String): Gender {
        return when (gender) {
            "MA" -> Gender.MA
            "FE" -> Gender.FE
            else -> Gender.OT
        }
    }
}
