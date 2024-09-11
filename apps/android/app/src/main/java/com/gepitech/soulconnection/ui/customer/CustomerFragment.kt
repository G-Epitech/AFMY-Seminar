package com.gepitech.soulconnection.ui.customer

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.gepitech.soulconnection.R
import com.gepitech.soulconnection.constants.config.API_URL
import com.gepitech.soulconnection.data.Customer
import com.gepitech.soulconnection.data.Gender
import com.gepitech.soulconnection.databinding.FragmentCustomerDetailsBinding

class CustomerFragment : Fragment() {

    private var _binding: FragmentCustomerDetailsBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCustomerDetailsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        val customer = arguments?.getParcelable<Customer>("customer")
        if (customer != null) {
            // Full Name
            binding.textViewFullName.text = "${customer.name} ${customer.surname}"

            // Email
            binding.textViewEmail.text = customer.email ?: "No email"
            binding.textViewEmail.setOnClickListener {
                val intent = Intent(Intent.ACTION_SENDTO).apply {
                    data = Uri.parse("mailto:${customer.email}")
                }
                if (intent.resolveActivity(requireActivity().packageManager) != null) {
                    startActivity(intent)
                }
            }

            // Phone
            binding.textViewPhone.text = customer.phone ?: "No phone"
            binding.textViewPhone.setOnClickListener {
                val intent = Intent(Intent.ACTION_DIAL).apply {
                    data = Uri.parse("tel:${customer.phone}")
                }
                if (intent.resolveActivity(requireActivity().packageManager) != null) {
                    startActivity(intent)
                }
            }

            // Birthdate
            binding.textViewBirthdate.text = customer.birthdate ?: "No birthdate"

            // Description
            binding.textViewDescription.text = customer.description ?: "No description"

            // Gender
            binding.textViewGender.text = getGender(customer.gender)

            // Address
            binding.textViewAddress.text = customer.address ?: "No address"
            binding.textViewAddress.setOnClickListener {
                val addressUri = Uri.parse("map:0,0?q=${Uri.encode(customer.address)}")
                val intent = Intent(Intent.ACTION_VIEW, addressUri)
                if (intent.resolveActivity(requireActivity().packageManager) != null) {
                    startActivity(intent)
                }
            }

            // Country
            binding.textViewCountry.text = customer.country ?: "No country"

            // Photo
            val photoUrl = customer.photo ?: ""
            if (photoUrl.isNotEmpty()) {
                Glide.with(this)
                    .load(API_URL + photoUrl)
                    .circleCrop()
                    .into(binding.imageViewPhoto)
            } else {
                binding.imageViewPhoto.setImageResource(R.drawable.ic_menu_gallery)
            }
        }

    }

    private fun getGender(gender: Gender?): String {
        if (gender == Gender.MA) {
            return "Male"
        }
        if (gender == Gender.FE) {
            return "Female"
        }
        return "Unknown"
    }
}
