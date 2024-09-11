package com.gepitech.soulconnection.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.gepitech.soulconnection.constants.config.API_URL
import com.gepitech.soulconnection.data.Customers
import com.gepitech.soulconnection.databinding.ItemCustomerBinding

class CustomersAdapter(var customers: List<Customers>) : RecyclerView.Adapter<CustomersAdapter.CustomerViewHolder>() {

    inner class CustomerViewHolder(private val binding: ItemCustomerBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(customer: Customers) {
            binding.textViewFullName.text = "${customer.name} ${customer.surname}"
            binding.textViewEmail.text = customer.email
            binding.textViewPhone.text = customer.phone
            Glide.with(binding.root)
                .load(API_URL + customer.photo)
                .circleCrop()
                .into(binding.imageViewPhoto)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomerViewHolder {
        val binding = ItemCustomerBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CustomerViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CustomerViewHolder, position: Int) {
        holder.bind(customers[position])
    }

    override fun getItemCount(): Int = customers.size
}
