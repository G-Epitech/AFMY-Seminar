package com.gepitech.soulconnection.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.gepitech.soulconnection.data.Gender
import com.gepitech.soulconnection.data.Permissions
import com.gepitech.soulconnection.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private val profileViewModel: ProfileViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        profileViewModel.fetchEmployee()
        profileViewModel.employee.observe(viewLifecycleOwner) { employee ->
            binding.textViewFullName.text = "${employee.name} ${employee.surname}"
            binding.textViewEmail.text = employee.email
            binding.textViewPhone.text = employee.phone
            binding.textViewAddress.text = employee.address
            binding.textViewPermission.text = getPermission(employee.permissions)
            binding.textViewRole.text = employee.role
            binding.textViewGender.text = getGender(employee.gender)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun getPermission(permission: Permissions?): String {
        return when (permission) {
            Permissions.EMPLOYEE -> "Employee"
            Permissions.COACH -> "Coach"
            else -> "Unknown"
        }
    }

    private fun getGender(gender: Gender?): String {
        return when (gender) {
            Gender.MA -> "Male"
            Gender.FE -> "Female"
            else -> "Unknown"
        }
    }
}