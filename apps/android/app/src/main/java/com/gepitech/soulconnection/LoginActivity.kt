package com.gepitech.soulconnection

import android.content.Intent
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Shader
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.gepitech.soulconnection.api.auth.login.AuthLoginRepository
import com.gepitech.soulconnection.api.auth.login.post.LoginPOSTRequest
import com.gepitech.soulconnection.api.auth.login.post.LoginPOSTResponse
import com.google.android.material.snackbar.Snackbar
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var authLoginRepository: AuthLoginRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        getApiInterfaces();

        val usernameInput = findViewById<EditText>(R.id.username)
        val passwordInput = findViewById<EditText>(R.id.password)
        val loginButton = findViewById<Button>(R.id.loginButton)

        val txtTitle = findViewById<TextView>(R.id.subtitleTextView)
        val paint = txtTitle.paint
        val width = paint.measureText(txtTitle.text.toString())
        txtTitle.paint.shader = LinearGradient(
            0f, 0f, width, txtTitle.textSize, intArrayOf(
                Color.parseColor("#FCAF6F"),
                Color.parseColor("#F97316"),
            ), null, Shader.TileMode.REPEAT)

        loginButton.setOnClickListener {
            val username = usernameInput.text.toString()
            val password = passwordInput.text.toString()

            login(username, password, findViewById(android.R.id.content))
        }
    }

    private fun saveToken(token: String) {
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        val editor = sharedPref.edit()
        editor.putString("authToken", token)
        editor.apply()
    }

    private fun getApiInterfaces() {
        authLoginRepository = AuthLoginRepository(this)
    }

    private fun login(username: String, password: String, view: View) {
        val loginRequest = LoginPOSTRequest(username, password)
        val call = authLoginRepository.login(loginRequest)

        call.enqueue(object : Callback<LoginPOSTResponse> {
            override fun onResponse(call: Call<LoginPOSTResponse>, response: Response<LoginPOSTResponse>) {
                if (response.isSuccessful) {
                    val token = response.body()?.tokens?.access
                    if (token == null) {
                        Snackbar.make(view, "Login failed: Token is null", Snackbar.LENGTH_LONG).show()
                        return
                    }
                    saveToken(token)
                    val intent = Intent(this@LoginActivity, MainActivity::class.java)
                    startActivity(intent)
                    finish()
                } else {
                    Log.e("LoginActivity", "Error: ${response.message()}")
                    Snackbar.make(view, "Login failed: invalid credentials", Snackbar.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<LoginPOSTResponse>, t: Throwable) {
                Log.e("LoginActivity", "Error: ${t.message}")
                Snackbar.make(view, "Login failed: ${t.message}", Snackbar.LENGTH_LONG).show()
            }
        })
    }


}
