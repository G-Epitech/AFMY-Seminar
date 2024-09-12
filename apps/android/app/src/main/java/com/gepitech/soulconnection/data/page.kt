package com.gepitech.soulconnection.data

data class PageResponse<T>(
    val items: List<T>,
    val pageIndex: Int,
    val pageSize: Int,
    val isLast: Boolean
)
