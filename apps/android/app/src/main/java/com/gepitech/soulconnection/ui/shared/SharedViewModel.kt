package com.gepitech.soulconnection.ui.shared

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModel : ViewModel() {
    private val _isLastPage = MutableLiveData<Boolean>()
    val isLastPage: LiveData<Boolean> get() = _isLastPage

    fun setLastPage(isLast: Boolean) {
        _isLastPage.value = isLast
    }
}
