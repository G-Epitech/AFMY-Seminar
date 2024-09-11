package com.gepitech.soulconnection.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.gepitech.soulconnection.adapter.CustomersAdapter
import com.gepitech.soulconnection.databinding.FragmentHomeBinding

class CustomersFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private val customerViewModel: CustomersViewModel by viewModels {
        CustomersViewModel.Factory(requireContext())
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val adapter = CustomersAdapter(emptyList())
        binding.recyclerViewCustomers.adapter = adapter
        binding.recyclerViewCustomers.layoutManager = LinearLayoutManager(requireContext())

        customerViewModel.customers.observe(viewLifecycleOwner) { customers ->
            adapter.customers = customers
            adapter.notifyDataSetChanged()
        }

        customerViewModel.loadCustomers(1, 10)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
