package com.gepitech.soulconnection.ui.home

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.gepitech.soulconnection.api.customers.CustomersRepository
import com.gepitech.soulconnection.data.Customers
import com.gepitech.soulconnection.data.PageResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CustomersViewModel(private val repository: CustomersRepository) : ViewModel() {
    private val _customers = MutableLiveData<List<Customers>>()
    val customers: LiveData<List<Customers>> get() = _customers

    init {
        // Créez quelques données d'exemple
        _customers.value = listOf(
            Customers(1, "John", "Doe", "john.doe@example.com", "123-456-7890", "https://thispersondoesnotexist.com/"),
            Customers(2, "Jane", "Smith", "jane.smith@example.com", "234-567-8901", "https://thispersondoesnotexist.com/"),
            Customers(3, "Alice", "Johnson", "alice.johnson@example.com", "345-678-9012", "https://thispersondoesnotexist.com/"),
            Customers(4, "Bob", "Williams", "bob.williams@example.com", "456-789-0123", "https://thispersondoesnotexist.com/")
        )
    }

    class Factory(private val context: Context) : ViewModelProvider.Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return CustomersViewModel(CustomersRepository(context)) as T
        }
    }

    fun loadCustomers(page: Int, size: Int) {
        val call = repository.getCustomers(page, size)

        call.enqueue(object : Callback<PageResponse<Customers>> {
            override fun onResponse(call: Call<PageResponse<Customers>>, response: Response<PageResponse<Customers>>) {
                if (response.isSuccessful) {
                    val user = response.body()
                    if (user == null) {
                        Log.e("MainActivity", "User is null")
                        return
                    }
                    _customers.value = _customers.value?.plus(user.items)
                    Log.i("MainActivity", "User: $user")
                } else {
                    Log.e("MainActivity", "Error: ${response.errorBody()}")
                }
            }

            override fun onFailure(call: Call<PageResponse<Customers>>, t: Throwable) {
                Log.e("MainActivity", "Error: ${t.message}")
            }
        })
    }
}
