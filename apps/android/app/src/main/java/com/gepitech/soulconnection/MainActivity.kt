package com.gepitech.soulconnection

import android.content.Intent
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Shader
import android.os.Bundle
import android.util.Log
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
import com.gepitech.soulconnection.api.employees.me.EmployeesMeRepository
import com.gepitech.soulconnection.api.employees.me.get.EmployeesMeGETResponse
import com.gepitech.soulconnection.constants.config.API_URL
import com.gepitech.soulconnection.data.Employee
import com.gepitech.soulconnection.data.Gender
import com.gepitech.soulconnection.data.Permissions
import com.gepitech.soulconnection.databinding.ActivityMainBinding
import com.google.android.material.navigation.NavigationView
import com.google.gson.Gson
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    private lateinit var employeesMeRepository: EmployeesMeRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initApiInterfaces()

        Log.i("MainActivity", "onCreate")

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarMain.toolbar)

        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_customers, R.id.nav_profile
            ), drawerLayout
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)

        val txtTitle = findViewById<TextView>(R.id.appTitle)
        val paint = txtTitle.paint
        val width = paint.measureText(txtTitle.text.toString())
        txtTitle.paint.shader = LinearGradient(
            0f, 0f, width, txtTitle.textSize, intArrayOf(
                Color.parseColor("#FCAF6F"),
                Color.parseColor("#F97316"),
            ), null, Shader.TileMode.REPEAT)

        authenticated { isAuthenticated ->
            Log.i("MainActivity", "Authenticated: $isAuthenticated")
            if (!isAuthenticated) {
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                finish()
                return@authenticated
            }
        }
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
        employeesMeRepository = EmployeesMeRepository(this)
    }

    private fun authenticated(callback: (Boolean) -> Unit) {
        val token = getSavedToken()

        if (token.isNullOrEmpty()) {
            callback(false)
            return
        }

        Log.i("MainActivity", "Token: $token")
        val call = employeesMeRepository.getMe()
        call.enqueue(object : Callback<EmployeesMeGETResponse> {
            override fun onResponse(call: Call<EmployeesMeGETResponse>, response: Response<EmployeesMeGETResponse>) {
                if (response.isSuccessful) {
                    val user = response.body()
                    if (user == null) {
                        Log.e("MainActivity", "User is null")
                        callback(false)
                        return
                    }
                    Log.i("MainActivity", "User: $user")
                    setEmployeeData(user)
                    Log.i("MainActivity", "User: ${response.body()}")
                    callback(true)
                } else {
                    Log.e("MainActivity", "Error: ${response.errorBody()}")
                    callback(false)
                }
            }

            override fun onFailure(call: Call<EmployeesMeGETResponse>, t: Throwable) {
                Log.e("MainActivity", "Error: ${t.message}")
                callback(false)
            }
        })
    }


    private fun setEmployeeData(user: EmployeesMeGETResponse) {
        val imageView = findViewById<ImageView>(R.id.imageProfile);
        Log.i("MainActivity", "ImageView: $imageView");
        if (imageView == null) {
            return
        }
        Glide.with(this)
            .load(API_URL + user.photo)
            .circleCrop()
            .into(imageView);

        val nameTextView = findViewById<TextView>(R.id.nameProfile);
        val fullName = user.name + " " + user.surname;
        nameTextView.text = fullName;

        val emailTextView = findViewById<TextView>(R.id.emailProfile);
        emailTextView.text = user.email;

        val employee: Employee = Employee(
            user.id,
            user.name,
            user.surname,
            user.email,
            user.phone,
            user.photo,
            user.address,
            getPermissions(user.permissions),
            getGender(user.gender),
            user.role
        )
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        val bundle = Bundle().apply {
            putParcelable("employee", employee)
        }
        val jsonString = Gson().toJson(bundle)
        with(sharedPref.edit()) {
            putString("employee", jsonString)
            apply()
        }
        Log.i("MainActivity", "Employee: $employee")
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