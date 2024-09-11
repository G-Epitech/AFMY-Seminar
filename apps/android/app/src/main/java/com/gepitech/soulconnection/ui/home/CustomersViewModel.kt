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
    private var _page = 0
    private var _size = 10
    private val _isLastPage = MutableLiveData<Boolean>(false)
    val isLastPage: LiveData<Boolean> get() = _isLastPage

    init {
        _customers.value = listOf()
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
                    _page = page
                    _size = size
                    _isLastPage.value = user.isLast
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

    fun loadNextPage() {
        _page++
        loadCustomers(_page, _size)
    }
}
