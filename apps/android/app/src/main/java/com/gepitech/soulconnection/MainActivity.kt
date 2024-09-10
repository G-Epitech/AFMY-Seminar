package com.gepitech.soulconnection

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.bumptech.glide.Glide
import com.gepitech.soulconnection.api.RetrofitInstance
import com.gepitech.soulconnection.api.employees.me.EmployeesMeService
import com.gepitech.soulconnection.api.employees.me.get.EmployeesMeGETResponse
import com.gepitech.soulconnection.constants.config.API_URL
import com.gepitech.soulconnection.databinding.ActivityMainBinding
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    private lateinit var emmployeesMeService: EmployeesMeService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);

        initApiInterfaces();

        if (!authenticated()) {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
            return
        }
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarMain.toolbar)

        binding.appBarMain.fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null)
                .setAnchorView(R.id.fab).show()
        }
        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow
            ), drawerLayout
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    private fun getSavedToken(): String? {
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        val token = sharedPref.getString("authToken", null)
        return token
    }

    private fun initApiInterfaces() {
        emmployeesMeService = RetrofitInstance.getInstance({ getSavedToken() }).create(EmployeesMeService::class.java)
    }

    private fun authenticated(): Boolean {
        val token = getSavedToken();

        if (token.isNullOrEmpty()) {
            return false
        }
        val call = emmployeesMeService.getMe()
        call.enqueue(object : Callback<EmployeesMeGETResponse> {
            override fun onResponse(call: Call<EmployeesMeGETResponse>, response: Response<EmployeesMeGETResponse>) {
                if (response.isSuccessful) {
                    val user = response.body()
                    if (user == null) {
                        Log.e("MainActivity", "User is null")
                        return
                    }
                    setEmployeeData(user)
                    Log.i("MainActivity", "User: ${response.body()}")
                } else {
                    Log.e("MainActivity", "Error: ${response.errorBody()}")
                }
            }

            override fun onFailure(call: Call<EmployeesMeGETResponse>, t: Throwable) {
                Log.e("MainActivity", "Error: ${t.message}")
            }
        })

        return true;
    }

    private fun setEmployeeData(user: EmployeesMeGETResponse) {
        val imageView = findViewById<ImageView>(R.id.imageProfile);
        Glide.with(this)
            .load(API_URL + user.photo)
            .circleCrop()
            .into(imageView);

        val nameTextView = findViewById<TextView>(R.id.nameProfile);
        val fullName = user.name + " " + user.surname;
        nameTextView.text = fullName;

        val emailTextView = findViewById<TextView>(R.id.emailProfile);
        emailTextView.text = user.email;
    }
}